import { useRef, useEffect } from 'react'
import { useVirtual } from 'react-virtual'

const TaskAxis = props => {
  const parentRef = useRef(false)

  const row_v = useVirtual({
    size: props.size,
    parentRef,
    estimateSize: props.calc_row_height,
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
            {s == null ? '…' : s}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TaskAxis
