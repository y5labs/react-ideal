import inject from 'seacreature/lib/inject'
import { useState, useCallback } from 'react'
import { DateTime } from 'luxon'
import data from './data'

import TimelimeAxis from './timelineaxis'
import TaskAxis from './taskaxis'
import Schedule from './schedule'

const col_width = 120
const row_height = 26

const nice_pos = pos => Math.round(pos * 100) / 100

const range = (start, end) =>
  Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx)
// TODO: leap year improvement?
const month_days = range(0, 11).map(n => {
  const start_at = DateTime.fromISO('2020-01-01').plus({ months: n })
  const end_at = start_at.plus({ months: 1 })
  return end_at.diff(start_at, 'days').as('days')
})
const offset_start = d =>
  nice_pos(((d.day - 1) / month_days[d.month - 1]) * col_width)
const offset_end = d => nice_pos((d.day / month_days[d.month - 1]) * col_width)

inject('pod', ({ StateContext, HubContext }) => {
  inject('route', [
    '/',
    p => () => {
      const PlanningView = () => {
        const [scrollOffsetTop, setScrollOffsetTop] = useState(0)
        const [scrollOffsetLeft, setScrollOffsetLeft] = useState(0)
        const [selectedIndex, setSelectedIndex] = useState(null)

        const time_dims = [
          DateTime.min(...data.map(({ start_at }) => start_at)),
          DateTime.max(...data.map(({ end_at }) => end_at))
        ]
        const start_at = time_dims[0].startOf('month')
        const time_axis_size =
          time_dims[1]
            .startOf('month')
            .diff(start_at, ['months'])
            .as('months') + 1
        const offset_to_time = n => {
          const d = start_at.plus({ months: n })
          return d.toFormat('MMM yy')
        }
        const time_window = dims => range(dims[0], dims[1]).map(offset_to_time)

        const task_dims = [0, data.length - 1]
        const task_axis_size = task_dims[1] - task_dims[0] + 1
        const offset_to_task = n => data[n].name
        const task_window = dims => range(dims[0], dims[1]).map(offset_to_task)

        const cache = {}
        const assert = (r, c, fn) => {
          if (!cache[r]) cache[r] = {}
          if (!cache[r][c]) cache[r][c] = fn()
          return cache[r][c]
        }

        const schedule_window = (row_dims, col_dims) => {
          const time_dims = [
            start_at.plus({ months: col_dims[0] }),
            start_at.plus({ months: col_dims[1] + 1 })
          ]

          const items = range(row_dims[0], row_dims[1]).map(r =>
            range(col_dims[0], col_dims[1]).map(i => cache?.[r]?.[i])
          )

          const filtered_tasks = data
            .slice(row_dims[0], row_dims[1])
            .map((t, i) => ({ t, i }))
            .filter(
              ({ t }) => t.end_at >= time_dims[0] && t.start_at < time_dims[1]
            )
          for (const { t, i } of filtered_tasks) {
            const oi = i + row_dims[0]

            const task_dims = [
              t.start_at
                .startOf('month')
                .diff(start_at, ['months'])
                .as('months'),
              t.end_at.startOf('month').diff(start_at, ['months']).as('months')
            ]

            const start_n = task_dims[0] - col_dims[0]
            const row_items = items[i]
            const standard = {
              t,
              i: oi,
              s: selectedIndex == oi
            }
            if (task_dims[0] == task_dims[1]) {
              if (!row_items[start_n])
                row_items[start_n] = assert(oi, task_dims[0], () => ({
                  ...standard,
                  type: 'startandend',
                  start: offset_start(t.start_at),
                  end: offset_end(t.end_at)
                }))
            } else {
              const end_n = task_dims[1] - col_dims[0]
              const offset = [offset_start(t.start_at), offset_end(t.end_at)]
              if (!row_items[start_n])
                row_items[start_n] = assert(oi, task_dims[0], () => ({
                  ...standard,
                  type: 'start',
                  start: offset[0],
                  end: (end_n - start_n) * col_width + offset[1]
                }))
              if (!row_items[end_n])
                row_items[end_n] = assert(oi, task_dims[1], () => ({
                  ...standard,
                  type: 'end',
                  start: (start_n - end_n) * col_width + offset[0],
                  end: offset[1]
                }))
              if (end_n - start_n > 1)
                for (const n of range(start_n + 1, end_n - 1))
                  if (!row_items[n])
                    row_items[n] = assert(oi, n + col_dims[0], () => ({
                      ...standard,
                      type: 'middle',
                      start: (start_n - n) * col_width + offset[0],
                      end: (end_n - n) * col_width + offset[1]
                    }))
            }
          }

          return items
        }

        const [renderCount, setRenderCount] = useState(0)
        const calc_col_width = useCallback(() => col_width, [renderCount])
        const calc_row_height = useCallback(() => row_height, [renderCount])

        const [scale, setScale] = useState('1m') // default scale
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
                {['1m', '1q', '1y'].map(u => (
                  <Timescale scale={scale} updateScale={setScale} unit={u} />
                ))}
              </nav>
            </div>
            <div className='wrapper'>
              <div className='task-title'>Tasks</div>
              <TimelimeAxis
                setScrollOffsetLeft={setScrollOffsetLeft}
                scrollOffsetLeft={scrollOffsetLeft}
                size={time_axis_size}
                calc_col_width={calc_col_width}
                render={(virtualItems, render) => {
                  const dims = [+Infinity, -Infinity]
                  for (const i of virtualItems) {
                    dims[0] = Math.min(dims[0], i.index)
                    dims[1] = Math.max(dims[1], i.index)
                  }
                  const items = time_window(dims)
                  return virtualItems.map(i => render(i, items[i.index - dims[0]]))
                }}
              />
              <TaskAxis
                setScrollOffsetTop={setScrollOffsetTop}
                scrollOffsetTop={scrollOffsetTop}
                size={task_axis_size}
                calc_row_height={calc_row_height}
                render={(virtualItems, render) => {
                  const dims = [+Infinity, -Infinity]
                  for (const i of virtualItems) {
                    dims[0] = Math.min(dims[0], i.index)
                    dims[1] = Math.max(dims[1], i.index)
                  }
                  const items = task_window(dims)
                  return virtualItems.map(i => render(i, items[i.index - dims[0]]))
                }}
              />
              <Schedule
                selectedIndex={selectedIndex}
                setScrollOffsetTop={setScrollOffsetTop}
                scrollOffsetTop={scrollOffsetTop}
                setScrollOffsetLeft={setScrollOffsetLeft}
                scrollOffsetLeft={scrollOffsetLeft}
                row_size={task_axis_size}
                col_size={time_axis_size}
                calc_row_height={calc_row_height}
                calc_col_width={calc_col_width}
                mapPos={dims => {
                  return dims
                }}
                onMove={({ task, index, delta }) => {
                  const months = delta[0] / col_width
                  data[index].start_at = task.start_at.plus({ months })
                  data[index].end_at = task.end_at.plus({ months })
                  setRenderCount(state => state + 1)
                }}
                onMoveStart={({ task, index, delta }) => {
                  const months = delta[0] / col_width
                  const d = data[index]
                  d.start_at = task.start_at.plus({ months })
                  if (d.end_at < d.start_at) d.end_at = d.start_at
                  setRenderCount(state => state + 1)
                }}
                onMoveEnd={({ task, index, delta }) => {
                  const months = delta[0] / col_width
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
                  const items = schedule_window(row_dims, col_dims)

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
