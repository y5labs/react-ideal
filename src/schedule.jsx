import { useRef, useState, useEffect } from 'react'
import { useVirtual } from 'react-virtual'
import { useDraggable } from 'react-use-draggable-scroll'
import Draggable from './draggable'

const col_width = 120

const Schedule = props => {
  const parentRef = useRef(false)
  const { events } = useDraggable(parentRef)

  const row_v = useVirtual({
    size: props.row_size,
    parentRef,
    estimateSize: props.calc_row_height,
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
    estimateSize: props.calc_col_width,
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
          const isMoving = dragState?.c == c.index && dragState?.r == r.index && dragState?.type == 'move'
          const isMovingStart = dragState?.c == c.index && dragState?.r == r.index && dragState?.type == 'start'
          const isMovingEnd = dragState?.c == c.index && dragState?.r == r.index && dragState?.type == 'end'
          const isDragRow = dragState?.r == r.index
          const isMovingAny = dragState?.type == 'move'
          const isSelected = s.i == props.selectedIndex
          const dims = [
              s.start + (isMovingStart ? dragState?.delta?.[0] : 0),
              s.end + (isMovingEnd ? dragState?.delta?.[0] : 0)
          ]
          const dimWidth = dims[1] - dims[0]
          if (isMovingStart) console.log(dims, dimWidth)
          const startPos = isSelected && !isMovingAny && (s.type == 'startandend' || s.type == 'start') ? s.start : null
          const endPos = isSelected && !isMovingAny && (s.type == 'startandend' || s.type == 'end') ? s.end : null
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
          return (
            <div
              key={`${r.index}/${c.index}`}
              style={{
                width: `${c.size}px`,
                height: `${r.size}px`,
                transform: `translateX(${c.start}px) translateY(${r.start}px)`
              }}
            >
              {isSelected
              ?
              <>
              <div
                className={
                  isMoving
                    ? 'moving'
                    : isMovingStart
                    ? 'moving-start'
                    : isMovingEnd
                    ? 'moving-end'
                    : isDragRow
                    ? 'imposter'
                    : dragState != null
                    ? ''
                    : isSelected
                    ? 'selected'
                    : ''
                }
              >
                <Draggable
                  onTap={() => props.onTap && props.onTap({ task: s.t, index: s.i })}
                  onDragStart={() => setDragState({ c: c.index, r: r.index, type: 'move' })}
                  onDrag={({ delta }) => {
                    setDragState(state => ({ ...state, delta }))
                    return [delta[0], 0]
                  }}
                  onDragEnd={({ delta }) => {
                    setDragState(null)
                    props.onMove && props.onMove({ task: s.t, index: s.i, delta })
                  }}
                >
                  {isMoving || isMovingStart || isMovingEnd ? (
                    <div
                      className='s e d'
                      style={{
                        position: 'absolute',
                        top: 0,
                        width: `${dimWidth}px`,
                        marginLeft: `${dims[0]}px`
                      }}
                    ></div>
                  ) : !isDragRow ? (
                    one()
                  ) : null}
                </Draggable>
              </div>
              {startPos != null && (
                <div className={'handle-start'} style={{ marginLeft: `${s.start}px` }}>
                  <Draggable
                    onDragStart={() =>
                      setDragState({
                        c: c.index,
                        r: r.index,
                        type: 'start',
                        delta: [0, 0]
                      })
                    }
                    onDrag={({ delta }) => {
                      setDragState(state => ({ ...state, delta }))
                      return [delta[0], 0]
                    }}
                    onDragEnd={({ delta }) => {
                      setDragState(null)
                      props.onMoveStart && props.onMoveStart({ task: s.t, index: s.i, delta })
                    }}
                  >
                    <div></div>
                  </Draggable>
                </div>
              )}
              {endPos != null && (
                <div className={'handle-end'} style={{ marginLeft: `${s.end}px` }}>
                  <Draggable
                    onDragStart={() =>
                      setDragState({
                        c: c.index,
                        r: r.index,
                        type: 'end',
                        delta: [0, 0]
                      })
                    }
                    onDrag={({ delta }) => {
                      setDragState(state => ({ ...state, delta }))
                      return [delta[0], 0]
                    }}
                    onDragEnd={({ delta }) => {
                      setDragState(null)
                      props.onMoveEnd && props.onMoveEnd({ task: s.t, index: s.i, delta })
                    }}
                  >
                    <div></div>
                  </Draggable>
                </div>
              )}
              </>
              : <div onClick={e => {
                props.onTap && props.onTap({ task: s.t, index: s.i })
                e.stopPropagation()
              }}>{one()}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Schedule
