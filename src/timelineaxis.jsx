import { useRef, useEffect } from 'react'
import { useVirtual } from 'react-virtual'

const TimelimeAxis = props => {
  const parentRef = useRef(false)

  const col_v = useVirtual({
    horizontal: true,
    size: props.size,
    parentRef,
    estimateSize: props.calc_col_width,
    scrollOffsetFn(e) {
      const left = e?.target.scrollLeft ?? 0
      props.setScrollOffsetLeft && props.setScrollOffsetLeft(left)
      return left
    }
  })

  const m = 50000

  const shortMoney = m => {
    return new Intl.NumberFormat('en-NZ', {
      maximumSignificantDigits: 3,
      notation: 'compact',
      // compactDisplay: 'short'
    }).format(m)
  }

  const highlightMoney = m => {
    const threshold = 100000
    return Math.round(m / threshold) * threshold >= threshold ? 'red' : ''
  }

  useEffect(() => {
    if ('scrollOffsetLeft' in props) col_v.scrollToOffset(props.scrollOffsetLeft)
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
            <span>{s}</span>
            <span className={highlightMoney(m)}>${shortMoney(m)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TimelimeAxis
