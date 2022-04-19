import inject from 'seacreature/lib/inject'
import React, { useEffect } from 'react'
import { useVirtual } from 'react-virtual'

inject('pod', ({ StateContext, HubContext }) => {
  inject('route', [
    '/',
    p => () => {
      const SyncedScrolls = () => {
        const [scrollOffset, setScrollOffset] = React.useState(0)

        const updateScrollOffset = val => setScrollOffset(val)

        const mainData = {
          // Main Data
        }

        const sidebarData = {
          // Sidebar Data
        }

        const mainProps = {
          updateScrollOffset,
          mainData,
          width: '500px'
        }

        const sidebarProps = {
          scrollable: false,
          scrollOffset,
          sidebarData,
        }

        return (
          <>
            <GridVirtualizerFixed {...sidebarProps} />
            <GridVirtualizerFixed {...mainProps} />
          </>
        )
      }

      const GridVirtualizerFixed = props => {
        const parentRef = React.useRef(false)

        React.useEffect(() => {
          rowVirtualizer.scrollToOffset(props.scrollOffset)
        }, [props.scrollOffset])

        const rowVirtualizer = useVirtual({
          size: 13,
          parentRef,
          estimateSize: React.useCallback(() => 100, []),
          overscan: 5,
          scrollOffsetFn(event) {
            const scrollTop = event?.target.scrollTop
            if (scrollTop > 0) {
              props.updateScrollOffset && props.updateScrollOffset(scrollTop)
              return scrollTop
            } else {
              props.updateScrollOffset && props.updateScrollOffset(0)
              return 0
            }
          }
          // do something to disable/prevent scrolling on sidebar
        })

        const columnVirtualizer = useVirtual({
          horizontal: true,
          size: 1,
          parentRef,
          estimateSize: React.useCallback(() => 100, []),
          overscan: 5
        })

        return (
          <>
            <div
              ref={parentRef}
              className='List'
              style={{
                display: 'inline-block',
                height: `500px`,
                width: props.width || 'auto',
                overflow: 'auto'
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
                    {columnVirtualizer.virtualItems.map(
                      virtualColumn => (
                        <div
                          key={virtualColumn.index}
                          className={
                            virtualColumn.index % 2
                              ? virtualRow.index % 2 === 0
                                ? 'ListItemOdd'
                                : 'ListItemEven'
                              : virtualRow.index % 2
                              ? 'ListItemOdd'
                              : 'ListItemEven'
                          }
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: `${virtualColumn.size}px`,
                            height: `${virtualRow.size}px`,
                            transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`
                          }}
                        >
                          Cell {virtualRow.index}, {virtualColumn.index}
                        </div>
                      )
                    )}
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
