import inject from 'seacreature/lib/inject'
import { useState, useCallback, Children } from 'react'
import { DateTime } from 'luxon'
import data from './data'

import TimelineAxis from './timelineaxis'
import TaskAxis from './taskaxis'
import Schedule from './schedule'

import * as timescales from './timescales'

inject('pod', ({ StateContext, HubContext }) => {
  inject('route', [
    '/',
    p => () => {
      const PlanningView = () => {
        const [scrollOffsetTop, setScrollOffsetTop] = useState(0)
        const [scrollOffsetLeft, setScrollOffsetLeft] = useState(0)
        const [selectedIndex, setSelectedIndex] = useState(null)
        const [scale, setScale] = useState('1m') // default scale

        const time_dims = [
          DateTime.min(...data.map(({ start_at }) => start_at)),
          DateTime.max(...data.map(({ end_at }) => end_at))
        ]
        const task_dims = [0, data.length - 1]

        const create = timescales.month

        const fns = create({
          selectedIndex,
          time_dims,
          task_dims,
          get_data: () => data
        })

        const [renderCount, setRenderCount] = useState(0)
        const calc_col_width = useCallback(() => timescales.col_width, [renderCount])
        const calc_row_height = useCallback(() => timescales.row_height, [renderCount])

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
                  const months = delta[0] / timescales.col_width
                  data[index].start_at = task.start_at.plus({ months })
                  data[index].end_at = task.end_at.plus({ months })
                  setRenderCount(state => state + 1)
                }}
                onMoveStart={({ task, index, delta }) => {
                  const months = delta[0] / timescales.col_width
                  const d = data[index]
                  d.start_at = task.start_at.plus({ months })
                  if (d.end_at < d.start_at) d.end_at = d.start_at
                  setRenderCount(state => state + 1)
                }}
                onMoveEnd={({ task, index, delta }) => {
                  const months = delta[0] / timescales.col_width
                  const d = data[index]
                  d.end_at = task.end_at.plus({ months })
                  if (d.end_at < d.start_at) d.start_at = d.end_at
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
