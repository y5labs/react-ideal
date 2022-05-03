import inject from 'seacreature/lib/inject'
import sleep from 'seacreature/lib/sleep'
import one_debounce from 'seacreature/lib/one_debounce'
import { useState, useCallback, useEffect, useContext, Children } from 'react'
import { DateTime } from 'luxon'
import data from './data'

import TimelineAxis from './timelineaxis'
import TaskAxis from './taskaxis'
import Schedule from './schedule'

import * as timescales from './timescales'

const range = (start, end) =>
  Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx)

const timescale_byunit = {
  '1m': timescales.month,
  '1q': timescales.quarter,
  '1y': timescales.year,
}

const empty_task = {
  name: null,
  start_at: null,
  end_at: null
}

inject('pod', ({ StateContext, HubContext }) => {
  inject('route', [
    '/',
    p => () => {
      const PlanningView = () => {
        const hub = useContext(HubContext)

        const [scrollOffsetTop, setScrollOffsetTop] = useState(0)
        const [scrollOffsetLeft, setScrollOffsetLeft] = useState(0)
        const [selectedIndex, setSelectedIndex] = useState(null)
        const [scale, setScale] = useState('1m') // default scale

        const time_dims = [
          DateTime.min(...data.map(({ start_at }) => start_at)),
          DateTime.max(...data.map(({ end_at }) => end_at))
        ]
        const task_dims = [0, data.length - 1]

        const [renderCount, setRenderCount] = useState(0)
        const [results, setResults] = useState({
          row_dims: [null, null],
          col_dims: [null, null],
          data: [],
          is_loaded: false
        })

        const fns = timescale_byunit[scale]({
          selectedIndex,
          time_dims,
          task_dims,
          get_data: dims => {
            if (results.data.length == 0)
              return range(dims[0], dims[1]).map(i => empty_task)
            return range(dims[0], dims[1]).map(i => {
              if (i < results.row_dims[0]) return empty_task
              if (i >= results.row_dims[1]) return empty_task
              return results.data[i - results.row_dims[0]]
            })
          }
        })

        const calc_col_width = useCallback(() => timescales.col_width, [renderCount])
        const calc_row_height = useCallback(() => timescales.row_height, [renderCount])

        useEffect(hub.effect(hub => {
          const next_row_dims = [null, null]
          const next_col_dims = [null, null]

          const current_row_dims = [null, null]
          const current_col_dims = [null, null]

          const query = one_debounce(async ({ row_dims, col_dims }) => {
            next_row_dims[0] = row_dims[0]
            next_row_dims[1] = row_dims[1]
            next_col_dims[0] = col_dims[0]
            next_col_dims[1] = col_dims[1]
            await sleep(0)
            setResults(res => ({ ...res, is_loaded: false }))
            // TODO: query server with diff
            await sleep(200)
            current_row_dims[0] = row_dims[0]
            current_row_dims[1] = row_dims[1]
            current_col_dims[0] = col_dims[0]
            current_col_dims[1] = col_dims[1]
            setResults({
              row_dims,
              col_dims,
              data: data.slice(row_dims[0], row_dims[1]),
              is_loaded: true
            })
          })

          hub.on('schedule window', ({ row_dims, col_dims }) => {
            if (row_dims[0] == next_row_dims[0]
              && row_dims[1] == next_row_dims[1]
              && col_dims[0] == next_col_dims[0]
              && col_dims[1] == next_col_dims[1]) return
            query({ row_dims, col_dims })
          })

          return () => {
          }
        }), [])

        const Timescale = p => {
          return (
            <button
              className={p.scale == p.unit ? 'selected' : ''}
              onClick={() => p.updateScale(p.unit)}
            >
              {p.unit}
            </button>
          )
        }

        return (
          <>
            <div className='filters'>
              <nav className='timescales'>
                {Children.toArray(['1m', '1q', '1y'].map(u => (
                  <Timescale scale={scale} updateScale={setScale} unit={u} />
                )))}
              </nav>
            </div>
            <div className='wrapper'>
              <div className='task-title'>Tasks</div>
              <TimelineAxis
                setScrollOffsetLeft={setScrollOffsetLeft}
                scrollOffsetLeft={scrollOffsetLeft}
                size={fns.time_axis_size}
                calc_col_width={calc_col_width}
                render={(virtualItems, render) => {
                  const dims = [+Infinity, -Infinity]
                  for (const i of virtualItems) {
                    dims[0] = Math.min(dims[0], i.index)
                    dims[1] = Math.max(dims[1], i.index)
                  }
                  const items = fns.time_window(dims)
                  return virtualItems.map(i => render(i, items[i.index - dims[0]]))
                }}
              />
              <TaskAxis
                setScrollOffsetTop={setScrollOffsetTop}
                scrollOffsetTop={scrollOffsetTop}
                size={fns.task_axis_size}
                calc_row_height={calc_row_height}
                render={(virtualItems, render) => {
                  const dims = [+Infinity, -Infinity]
                  for (const i of virtualItems) {
                    dims[0] = Math.min(dims[0], i.index)
                    dims[1] = Math.max(dims[1], i.index)
                  }
                  const items = fns.task_window(dims)
                  return virtualItems.map(i => render(i, items[i.index - dims[0]]))
                }}
              />
              <Schedule
                selectedIndex={selectedIndex}
                setScrollOffsetTop={setScrollOffsetTop}
                scrollOffsetTop={scrollOffsetTop}
                setScrollOffsetLeft={setScrollOffsetLeft}
                scrollOffsetLeft={scrollOffsetLeft}
                row_size={fns.task_axis_size}
                col_size={fns.time_axis_size}
                calc_row_height={calc_row_height}
                calc_col_width={calc_col_width}
                mapPos={dims => {
                  return dims
                }}
                onMove={({ task, index, delta }) => {
                  [
                    data[index].start_at,
                    data[index].end_at
                  ] = fns.calc_move({ task, index, delta })
                  setRenderCount(state => state + 1)
                }}
                onMoveStart={({ task, index, delta }) => {
                  [
                    data[index].start_at,
                    data[index].end_at
                  ] = fns.calc_move_start({ task, index, delta })
                  setRenderCount(state => state + 1)
                }}
                onMoveEnd={({ task, index, delta }) => {
                  [
                    data[index].start_at,
                    data[index].end_at
                  ] = fns.calc_move_end({ task, index, delta })
                  setRenderCount(state => state + 1)
                }}
                onTap={({ task, index }) => {
                  if (selectedIndex == index) setSelectedIndex(null)
                  else setSelectedIndex(index)
                  setRenderCount(state => state + 1)
                }}
                render={(row_v, col_v, render) => {
                  const row_dims = [+Infinity, -Infinity]
                  for (const i of row_v) {
                    row_dims[0] = Math.min(row_dims[0], i.index)
                    row_dims[1] = Math.max(row_dims[1], i.index)
                  }
                  const col_dims = [+Infinity, -Infinity]
                  for (const i of col_v) {
                    col_dims[0] = Math.min(col_dims[0], i.index)
                    col_dims[1] = Math.max(col_dims[1], i.index)
                  }
                  hub.emit('schedule window', { row_dims, col_dims })
                  const items = fns.schedule_window(row_dims, col_dims)

                  return row_v.map(r =>
                    col_v.map(c => render(r, c, items[r.index - row_dims[0]][c.index - col_dims[0]]))
                  )
                }}
              />
            </div>
          </>
        )
      }

      return <PlanningView />
    }
  ])
})
