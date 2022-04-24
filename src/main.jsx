import inject from 'seacreature/lib/inject'
import { useRef, useState, useCallback, useEffect } from 'react'
import { useVirtual } from 'react-virtual'
import { DateTime } from 'luxon'
import { useDraggable } from 'react-use-draggable-scroll'
import Draggable from './draggable'
import data from './data'

const col_width = 120
const row_height = 26

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
const offset_start = d => ((d.day - 1) / month_days[d.month - 1]) * col_width
const offset_end = d => (d.day / month_days[d.month - 1]) * col_width

const TimelimeAxis = props => {
  const parentRef = useRef(false)

  const col_v = useVirtual({
    horizontal: true,
    size: props.size,
    parentRef,
    estimateSize: useCallback(() => col_width, []),
    scrollOffsetFn(e) {
      const left = e?.target.scrollLeft ?? 0
      props.setScrollOffsetLeft && props.setScrollOffsetLeft(left)
      return left
    }
  })

  useEffect(() => {
    if ('scrollOffsetLeft' in props)
      col_v.scrollToOffset(props.scrollOffsetLeft)
  }, [props.scrollOffsetLeft])

  return (
    <div ref={parentRef} className='timeline-axis'>
      <div style={{ width: `${col_v.totalSize}px`, position: 'relative' }}>
        {props.render(col_v.virtualItems, (i, s) => (
          <div
            key={i.index}
            style={{
              width: `${i.size}px`,
              transform: `translateX(${i.start}px)`
            }}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  )
}

const TaskAxis = props => {
  const parentRef = useRef(false)

  const row_v = useVirtual({
    size: props.size,
    parentRef,
    estimateSize: useCallback(() => row_height, []),
    scrollOffsetFn(e) {
      const top = e?.target.scrollTop ?? 0
      props.setScrollOffsetTop && props.setScrollOffsetTop(top)
      return top
    }
  })

  useEffect(() => {
    if ('scrollOffsetTop' in props) row_v.scrollToOffset(props.scrollOffsetTop)
  }, [props.scrollOffsetTop])

  return (
    <div ref={parentRef} className='task-axis'>
      <div style={{ height: `${row_v.totalSize}px`, position: 'relative' }}>
        {props.render(row_v.virtualItems, (i, s) => (
          <div
            key={i.index}
            style={{
              height: `${i.size}px`,
              transform: `translateY(${i.start}px)`
            }}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  )
}

const Schedule = props => {
  const parentRef = useRef(false)
  const { events } = useDraggable(parentRef)

  const row_v = useVirtual({
    size: props.row_size,
    parentRef,
    estimateSize: useCallback(() => row_height, []),
    scrollOffsetFn(e) {
      const top = e?.target.scrollTop ?? 0
      props.setScrollOffsetTop && props.setScrollOffsetTop(top)
      return top
    }
  })

  const col_v = useVirtual({
    horizontal: true,
    size: props.col_size,
    parentRef,
    estimateSize: useCallback(() => col_width, []),
    scrollOffsetFn(e) {
      const left = e?.target.scrollLeft ?? 0
      props.setScrollOffsetLeft && props.setScrollOffsetLeft(left)
      return left
    }
  })

  useEffect(() => {
    if ('scrollOffsetTop' in props) row_v.scrollToOffset(props.scrollOffsetTop)
  }, [props.scrollOffsetTop])

  // useEffect(() => {
  //   if ('scrollOffsetLeft' in props) col_v.scrollToOffset(props.scrollOffsetLeft)
  // }, [props.scrollOffsetLeft])

  const [dragState, setDragState] = useState(null)

  return (
    <div {...events} ref={parentRef} className='schedule-grid'>
      <div
        style={{
          height: `${row_v.totalSize}px`,
          width: `${col_v.totalSize}px`,
          position: 'relative'
        }}
      >
        {props.render(row_v.virtualItems, col_v.virtualItems, (r, c, s) => {
          if (!s) return
          const one = () =>
            s.type == 'startandend' ? (
              <div
                className='s e'
                style={{
                  position: 'absolute',
                  top: 0,
                  width: `${s.end - s.start}px`,
                  marginLeft: `${s.start}px`
                }}
              ></div>
            ) : s.type == 'start' ? (
              <div
                className='s'
                style={{
                  width: `${col_width - s.start}px`,
                  marginLeft: `${s.start}px`
                }}
              ></div>
            ) : s.type == 'end' ? (
              <div className='e' style={{ width: `${s.end}px` }}></div>
            ) : s.type == 'middle' ? (
              <div className='m' style={{ width: `${col_width}px` }}></div>
            ) : (
              ''
            )
          const isDragging = dragState?.c == c.index && dragState?.r == r.index
          return (
            <div
              key={`${r.index}/${c.index}`}
              style={{
                width: `${c.size}px`,
                height: `${r.size}px`,
                transform: `translateX(${c.start}px) translateY(${r.start}px)`
              }}
            >
              <Draggable
                onDragStart={() => setDragState({ c: c.index, r: r.index })}
                onDrag={({ delta }) => [delta[0], 0]}
                onDragEnd={({ delta }) => {
                  console.log(s)
                  setDragState(null)
                }}
              >
                {isDragging ? (
                  <div
                    className='s e d'
                    style={{
                      position: 'absolute',
                      top: 0,
                      width: `${s.end - s.start}px`,
                      marginLeft: `${s.start}px`
                    }}
                  ></div>
                ) : (
                  one()
                )}
              </Draggable>
              {isDragging && one()}
            </div>
          )
        })}
      </div>
    </div>
  )
}

inject('pod', ({ StateContext, HubContext }) => {
  inject('route', [
    '/',
    p => () => {
      const PlanningView = () => {
        const [scrollOffsetTop, setScrollOffsetTop] = useState(0)
        const [scrollOffsetLeft, setScrollOffsetLeft] = useState(0)

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
            const task_dims = [
              t.start_at
                .startOf('month')
                .diff(start_at, ['months'])
                .as('months'),
              t.end_at.startOf('month').diff(start_at, ['months']).as('months')
            ]

            const start_n = task_dims[0] - col_dims[0]
            const row_items = items[i]
            if (task_dims[0] == task_dims[1]) {
              if (!row_items[start_n])
                row_items[start_n] = assert(i, task_dims[0], () => ({
                  type: 'startandend',
                  t,
                  start: offset_start(t.start_at),
                  end: offset_end(t.end_at)
                }))
            } else {
              const end_n = task_dims[1] - col_dims[0]
              const offset = [offset_start(t.start_at), offset_end(t.end_at)]
              if (!row_items[start_n])
                row_items[start_n] = assert(
                  i + row_dims[0],
                  task_dims[0],
                  () => ({
                    type: 'start',
                    t,
                    start: offset[0],
                    end: (end_n - start_n) * col_width + offset[0]
                  })
                )
              if (!row_items[end_n])
                row_items[end_n] = assert(
                  i + row_dims[0],
                  task_dims[1],
                  () => ({
                    type: 'end',
                    t,
                    start: (start_n - end_n) * col_width + offset[0],
                    end: offset[0]
                  })
                )
              if (end_n - start_n > 1)
                for (const n of range(start_n + 1, end_n - 1))
                  if (!row_items[n])
                    row_items[n] = assert(
                      i + row_dims[0],
                      n + col_dims[0],
                      () => ({
                        type: 'middle',
                        t,
                        start: (start_n - n) * col_width + offset[0],
                        end: (end_n - n) * col_width + offset[0]
                      })
                    )
            }
          }

          return items
        }

        return (
          <div className='wrapper'>
            <div className='task-title'>Tasks</div>
            <TimelimeAxis
              setScrollOffsetLeft={setScrollOffsetLeft}
              scrollOffsetLeft={scrollOffsetLeft}
              size={time_axis_size}
              render={(virtualItems, render) => {
                const dims = [+Infinity, -Infinity]
                for (const i of virtualItems) {
                  dims[0] = Math.min(dims[0], i.index)
                  dims[1] = Math.max(dims[1], i.index)
                }
                const items = time_window(dims)
                return virtualItems.map(i =>
                  render(i, items[i.index - dims[0]])
                )
              }}
            />
            <TaskAxis
              setScrollOffsetTop={setScrollOffsetTop}
              scrollOffsetTop={scrollOffsetTop}
              data={data}
              size={task_axis_size}
              render={(virtualItems, render) => {
                const dims = [+Infinity, -Infinity]
                for (const i of virtualItems) {
                  dims[0] = Math.min(dims[0], i.index)
                  dims[1] = Math.max(dims[1], i.index)
                }
                const items = task_window(dims)
                return virtualItems.map(i =>
                  render(i, items[i.index - dims[0]])
                )
              }}
            />
            <Schedule
              setScrollOffsetTop={setScrollOffsetTop}
              scrollOffsetTop={scrollOffsetTop}
              setScrollOffsetLeft={setScrollOffsetLeft}
              scrollOffsetLeft={scrollOffsetLeft}
              row_size={task_axis_size}
              col_size={time_axis_size}
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
                  col_v.map(c =>
                    render(
                      r,
                      c,
                      items[r.index - row_dims[0]][c.index - col_dims[0]]
                    )
                  )
                )
              }}
            />
          </div>
        )
      }

      return <PlanningView />
    }
  ])
})
