import inject from 'seacreature/lib/inject'
import React from 'react'
import { useVirtual } from 'react-virtual'

inject('pod', ({ StateContext, HubContext }) => {
  inject('route', [
    '/',
    p => () => {
      const SyncedScrolls = () => {
        const [scrollOffsetTop, setScrollOffsetTop] = React.useState(0)
        const [scrollOffsetLeft, setScrollOffsetLeft] = React.useState(0)

        const updateScrollOffsetTop = val => setScrollOffsetTop(val)
        const updateScrollOffsetLeft = val => setScrollOffsetLeft(val)

        const tableData = [
          [{ task: 'a', month: "Jan '22", start: 15, days: 30 }],
          [{ task: 'b', month: "Jan '22", start: 10, days: 20 }],
          [{ task: 'c', month: "Mar '22", start: 25, days: 40 }],
          [{ task: 'd', month: "Feb '22", start: 5, days: 10 }],
          [{ task: 'e', month: "Feb '22", start: 30, days: 15 }]
        ]
        const rowHeadingData = [['Task A'], ['Task B'], ['Task C'], ['Task D'], ['Task E']]
        const columnHeadingData = [
          [
            "Jan '22",
            "Feb '22",
            "Mar '22",
            "Apr '22",
            "May '22",
            "Jun '22",
            "Jul '22",
            "Aug '22",
            "Sep '22",
            "Oct '22",
            "Nov '22",
            "Dev '22"
          ]
        ]

        const tableOptions = {
          styles: {
            background: 'LightGray',
            overflow: 'auto',
            gridArea: '2 / 2 / 3 / 3'
          },
          updateScrollOffsetTop,
          updateScrollOffsetLeft,
          data: tableData,
          rowSize: 60,
          columnSize: 120
        }

        const rowHeadingOptions = {
          styles: {
            background: 'GoldenRod',
            overflow: 'hidden',
            gridArea: '2 / 1 / 3 / 2'
          },
          scrollOffsetTop,
          data: rowHeadingData,
          rowSize: 60,
          columnSize: 120
        }

        const columnHeadingOptions = {
          styles: {
            background: 'MediumSeaGreen',
            overflow: 'hidden',
            gridArea: '1 / 2 / 2 / 3'
          },
          scrollOffsetLeft,
          data: columnHeadingData,
          rowSize: 60,
          columnSize: 120
        }

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
            <GridVirtualizerFixed {...columnHeadingOptions} />
            <GridVirtualizerFixed {...rowHeadingOptions} />
            <GridVirtualizerFixed {...tableOptions} />
          </div>
        )
      }

      const GridVirtualizerFixed = props => {
        const parentRef = React.useRef(false)

        React.useEffect(() => {
          if ('scrollOffsetTop' in props) rowVirtualizer.scrollToOffset(props.scrollOffsetTop)
          if ('scrollOffsetLeft' in props) columnVirtualizer.scrollToOffset(props.scrollOffsetLeft)
        }, [props.scrollOffsetTop, props.scrollOffsetLeft])

        const rowVirtualizer = useVirtual({
          size: props.data.length,
          parentRef,
          estimateSize: React.useCallback(() => props.rowSize, []),
          overscan: 5,
          scrollOffsetFn(event) {
            const top = event?.target.scrollTop
            if (top >= 0) {
              props.updateScrollOffsetTop && props.updateScrollOffsetTop(top)
              return top
            } else {
              props.updateScrollOffsetTop && props.updateScrollOffsetTop(0)
              return 0
            }
          }
        })

        const columnVirtualizer = useVirtual({
          horizontal: true,
          size: props.data[0].length,
          parentRef,
          estimateSize: React.useCallback(() => props.columnSize, []),
          overscan: 5,
          scrollOffsetFn(event) {
            const left = event?.target.scrollLeft
            if (left >= 0) {
              props.updateScrollOffsetLeft && props.updateScrollOffsetLeft(left)
              return left
            } else {
              props.updateScrollOffsetLeft && props.updateScrollOffsetLeft(0)
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
                ...props.styles
              }}
            >
              <div
                style={{
                  height: `${rowVirtualizer.totalSize}px`,
                  width: `${columnVirtualizer.totalSize}px`,
                  position: 'relative'
                }}
              >
                {rowVirtualizer.virtualItems.map(virtualRow => (
                  <React.Fragment key={virtualRow.index}>
                    {columnVirtualizer.virtualItems.map(virtualColumn => {
                      const cellData = props.data[virtualRow.index][virtualColumn.index]
                      console.log(cellData)
                      // Plain text cell data
                      if (Object.keys(cellData).length === 0)
                        return (
                          <div
                            key={virtualColumn.index}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: `${virtualColumn.size}px`,
                              height: `${virtualRow.size}px`,
                              transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`
                            }}
                          >
                            {cellData}
                          </div>
                        )

                      // Custom cell data
                      return (<div
                            key={virtualColumn.index}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: `${virtualColumn.size}px`,
                              height: `${virtualRow.size}px`,
                              transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`
                            }}
                          >

                          </div>)
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </>
        )
      }

      return <SyncedScrolls />
    }
  ])
})
