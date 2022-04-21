import inject from 'seacreature/lib/inject'
import React from 'react'
import { useVirtual } from 'react-virtual'
import { DateTime } from 'luxon'

const range = (start, end) => Array(end - start + 1).fill().map((_, idx) => start + idx)

inject('pod', ({ StateContext, HubContext }) => {
  inject('route', [
    '/',
    p => () => {
      const SyncedScrolls = () => {
        const [scrollOffsetTop, setScrollOffsetTop] = React.useState(0)
        const [scrollOffsetLeft, setScrollOffsetLeft] = React.useState(0)

        const data = [
          { name: 'A', start_at: '2022-01-15', end_at: '2022-01-20' },
          { name: 'B', start_at: '2022-01-15', end_at: '2022-01-20' },
          { name: 'C', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'D', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'E', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'F', start_at: '2022-04-15', end_at: '2024-04-20' },
          { name: 'A', start_at: '2022-01-15', end_at: '2022-01-20' },
          { name: 'B', start_at: '2022-01-15', end_at: '2022-01-20' },
          { name: 'C', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'D', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'E', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'F', start_at: '2022-04-15', end_at: '2024-04-20' },
          { name: 'A', start_at: '2022-01-15', end_at: '2022-01-20' },
          { name: 'B', start_at: '2022-01-15', end_at: '2022-01-20' },
          { name: 'C', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'D', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'E', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'F', start_at: '2022-04-15', end_at: '2024-04-20' },
          { name: 'A', start_at: '2022-01-15', end_at: '2022-01-20' },
          { name: 'B', start_at: '2022-01-15', end_at: '2022-01-20' },
          { name: 'C', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'D', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'E', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'F', start_at: '2022-04-15', end_at: '2024-04-20' },
          { name: 'A', start_at: '2022-01-15', end_at: '2022-01-20' },
          { name: 'B', start_at: '2022-01-15', end_at: '2022-01-20' },
          { name: 'C', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'D', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'E', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'F', start_at: '2022-04-15', end_at: '2024-04-20' },
          { name: 'A', start_at: '2022-01-15', end_at: '2022-01-20' },
          { name: 'B', start_at: '2022-01-15', end_at: '2022-01-20' },
          { name: 'C', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'D', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'E', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'F', start_at: '2022-04-15', end_at: '2024-04-20' },
          { name: 'A', start_at: '2022-01-15', end_at: '2022-01-20' },
          { name: 'B', start_at: '2022-01-15', end_at: '2022-01-20' },
          { name: 'C', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'D', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'E', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'F', start_at: '2022-04-15', end_at: '2024-04-20' },
          { name: 'A', start_at: '2022-01-15', end_at: '2022-01-20' },
          { name: 'B', start_at: '2022-01-15', end_at: '2022-01-20' },
          { name: 'C', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'D', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'E', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'F', start_at: '2022-04-15', end_at: '2024-04-20' },
          { name: 'A', start_at: '2022-01-15', end_at: '2022-01-20' },
          { name: 'B', start_at: '2022-01-15', end_at: '2022-01-20' },
          { name: 'C', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'D', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'E', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'F', start_at: '2022-04-15', end_at: '2024-04-20' },
          { name: 'A', start_at: '2022-01-15', end_at: '2022-01-20' },
          { name: 'B', start_at: '2022-01-15', end_at: '2022-01-20' },
          { name: 'C', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'D', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'E', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'F', start_at: '2022-04-15', end_at: '2024-04-20' },
          { name: 'A', start_at: '2022-01-15', end_at: '2022-01-20' },
          { name: 'B', start_at: '2022-01-15', end_at: '2022-01-20' },
          { name: 'C', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'D', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'E', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'F', start_at: '2022-04-15', end_at: '2024-04-20' },
          { name: 'A', start_at: '2022-01-15', end_at: '2022-01-20' },
          { name: 'B', start_at: '2022-01-15', end_at: '2022-01-20' },
          { name: 'C', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'D', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'E', start_at: '2022-03-15', end_at: '2022-04-20' },
          { name: 'F', start_at: '2022-04-15', end_at: '2024-04-20' },
        ]

        const time_dims = [
          data.reduce((acc, { start_at }) =>  acc < start_at ? acc : start_at, null),
          data.reduce((acc, { end_at }) =>  acc > end_at ? acc : end_at, null)
        ]
        const start_at = DateTime.fromISO(time_dims[0]).startOf('month')
        const time_axis_size = DateTime.fromISO(time_dims[1]).startOf('month').diff(start_at, ['months']).as('months') + 1
        const offset_to_time = n => {
          const d = start_at.plus({ months: n })
          return d.toFormat('MMM yy')
        }
        const time_window = dims =>
          range(dims[0], dims[1]).map(offset_to_time)

        const task_dims = [0, data.length - 1]
        const task_axis_size = task_dims[1] - task_dims[0] + 1
        const offset_to_task = n => data[n].name
        const task_window = dims =>
          range(dims[0], dims[1]).map(offset_to_task)

        const schedule_window = (row_dims, col_dims) => {
          const time_dims = [
            start_at.plus({ months: col_dims[0] }).toFormat('yyyy-MM-dd'),
            start_at.plus({ months: col_dims[1] + 1 }).toFormat('yyyy-MM-dd')
          ]

          const items = range(row_dims[0], row_dims[1]).map(r => range(col_dims[0], col_dims[1]).map(i => ({})))

          const filtered_tasks = data
            .slice(row_dims[0], row_dims[1])
            .map((t, i) => ({ t, i }))
            .filter(({ t }) => t.end_at >= time_dims[0] && t.start_at < time_dims[1])
          for (const {t, i} of filtered_tasks) {
              const task_dims = [
                DateTime.fromISO(t.start_at).startOf('month').diff(start_at, ['months']).as('months'),
                DateTime.fromISO(t.end_at).startOf('month').diff(start_at, ['months']).as('months')
              ]
              if (task_dims[0] == task_dims[1])
                items[i][task_dims[0] - col_dims[0]] = { type: 'startandend', t }
              else {
                const start_n = task_dims[0] - col_dims[0]
                const end_n = task_dims[1] - col_dims[0]
                items[i][start_n] = { type: 'start', t }
                items[i][end_n] = { type: 'end', t }
                if (end_n - start_n > 1) {
                  for (const n of range(start_n + 1, end_n - 1))
                    items[i][n] = { type: 'middle', t }
                }
              }
            }



          return items
        }


        const tableData = [
          [{ task: 'a', month: "Jan '22", start: 15, days: 30 }],
          [{ task: 'b', month: "Jan '22", start: 10, days: 20 }],
          [{ task: 'c', month: "Mar '22", start: 25, days: 40 }],
          [{ task: 'd', month: "Feb '22", start: 5, days: 10 }],
          [{ task: 'e', month: "Feb '22", start: 30, days: 15 }]
        ]

        return (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gridTemplateRows: 'auto 1fr',
              gridColumnGap: '0px',
              gridRowGap: '0px',
              height: '100%'
            }}
          >
            <TimelimeAxis
              scrollOffsetLeft={scrollOffsetLeft}
              size={time_axis_size}
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
                return virtualItems.map(i => render(i, items[i.index - dims[0]]))
              }}
              />
            <Schedule
              setScrollOffsetTop={setScrollOffsetTop}
              setScrollOffsetLeft={setScrollOffsetLeft}
              data={tableData}
              row_size={task_axis_size}
              col_size={time_axis_size}
              render={(virtualRows, virtualColumns, render) => {
                const row_dims = [+Infinity, -Infinity]
                for (const i of virtualRows) {
                  row_dims[0] = Math.min(row_dims[0], i.index)
                  row_dims[1] = Math.max(row_dims[1], i.index)
                }
                const col_dims = [+Infinity, -Infinity]
                for (const i of virtualColumns) {
                  col_dims[0] = Math.min(col_dims[0], i.index)
                  col_dims[1] = Math.max(col_dims[1], i.index)
                }
                const items = schedule_window(row_dims, col_dims)

                // console.log(virtualRows, virtualColumns, row_dims, col_dims)

                return virtualRows.map(r =>
                  virtualColumns.map(c => {
                    const item = items[r.index - row_dims[0]][c.index - col_dims[0]]
                    return render(r, c, item)
                  })
                )
              }}
            />
          </div>
        )
      }

      const TimelimeAxis = props => {
        const parentRef = React.useRef(false)

        const columnVirtualizer = useVirtual({
          horizontal: true,
          size: props.size,
          parentRef,
          estimateSize: React.useCallback(() => 120, [])
        })

        React.useEffect(() => {
          if ('scrollOffsetLeft' in props) columnVirtualizer.scrollToOffset(props.scrollOffsetLeft)
        }, [props.scrollOffsetLeft])

        return (
          <>
            <div
              ref={parentRef}
              className='List'
              style={{
                background: 'silver',
                overflow: 'hidden',
                gridArea: '1 / 2 / 2 / 3'
              }}
            >
              <div
                style={{
                  height: `60px`,
                  width: `${columnVirtualizer.totalSize}px`,
                  position: 'relative'
                }}
              >
                {props.render(columnVirtualizer.virtualItems, (i, s) =>
                  <div
                    key={i.index}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: `${i.size}px`,
                      height: `60px`,
                      transform: `translateX(${i.start}px) translateY(0px)`
                    }}>
                    {s}
                  </div>
                )}
              </div>
            </div>
          </>
        )
      }

      const TaskAxis = props => {
        const parentRef = React.useRef(false)

        const rowVirtualizer = useVirtual({
          size: props.size,
          parentRef,
          estimateSize: React.useCallback(() => 60, []),
          overscan: 5
        })

        React.useEffect(() => {
          if ('scrollOffsetTop' in props) rowVirtualizer.scrollToOffset(props.scrollOffsetTop)
        }, [props.scrollOffsetTop])

        return (
          <>
            <div
              ref={parentRef}
              className='List'
              style={{
                background: 'MediumSeaGreen',
                overflow: 'hidden',
                gridArea: '2 / 1 / 3 / 2'
              }}
            >
              <div
                style={{
                  height: `${rowVirtualizer.totalSize}px`,
                  width: `120px`,
                  position: 'relative'
                }}
              >
                {props.render(rowVirtualizer.virtualItems, (i, s) =>
                  <div
                    key={i.index}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: `120px`,
                      height: `${i.size}px`,
                      transform: `translateX(${0}px) translateY(${i.start}px)`
                    }}
                  >
                    {s}
                  </div>
                )}
              </div>
            </div>
          </>
        )
      }

      const Schedule = props => {
        const parentRef = React.useRef(false)

        const rowVirtualizer = useVirtual({
          size: props.row_size,
          parentRef,
          estimateSize: React.useCallback(() => 60, []),
          scrollOffsetFn(event) {
            const top = event?.target.scrollTop
            if (top >= 0) {
              props.setScrollOffsetTop && props.setScrollOffsetTop(top)
              return top
            } else {
              props.setScrollOffsetTop && props.setScrollOffsetTop(0)
              return 0
            }
          }
        })

        const columnVirtualizer = useVirtual({
          horizontal: true,
          size: props.col_size,
          parentRef,
          estimateSize: React.useCallback(() => 120, []),
          scrollOffsetFn(event) {
            const left = event?.target.scrollLeft
            if (left >= 0) {
              props.setScrollOffsetLeft && props.setScrollOffsetLeft(left)
              return left
            } else {
              props.setScrollOffsetLeft && props.setScrollOffsetLeft(0)
              return 0
            }
          }
        })

        return (
          <>
            <div
              ref={parentRef}
              className='List'
              style={{
                background: 'LightGray',
                overflow: 'auto',
                gridArea: '2 / 2 / 3 / 3'
              }}
            >
              <div
                style={{
                  height: `${rowVirtualizer.totalSize}px`,
                  width: `${columnVirtualizer.totalSize}px`,
                  position: 'relative'
                }}
              >
                {props.render(rowVirtualizer.virtualItems, columnVirtualizer.virtualItems, (r, c, s) =>
                  <div
                    key={`${r.index}/${c.index}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: `${c.size}px`,
                      height: `${r.size}px`,
                      transform: `translateX(${c.start}px) translateY(${r.start}px)`
                    }}
                  >
                    {
                    s.type == 'startandend'
                    ? 'startandend'
                    : s.type == 'start'
                    ? 'start'
                    : s.type == 'end'
                    ? 'end'
                    : s.type == 'middle'
                    ? 'middle'
                    : ''}
                  </div>
                )}
              </div>
            </div>
          </>
        )
      }

      return <SyncedScrolls />
    }
  ])
})
