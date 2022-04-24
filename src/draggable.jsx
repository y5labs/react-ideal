import { useState, useCallback, useMemo, useEffect } from 'react'

const Draggable = ({
  position = [0, 0],
  children,
  onDragStart,
  onDrag,
  onDragEnd
}) => {
  const [state, setState] = useState({
    isDragging: false,
    origin: [0, 0],
    delta: [0, 0]
  })

  const handleMouseDown = useCallback(
    e => {
      setState(state => ({
        ...state,
        isDragging: true,
        origin: [e.clientX, e.clientY]
      }))
      if (onDragStart) onDragStart({ clientX: e.clientX, clientY: e.clientY })
      e.stopPropagation()
    },
    [onDragStart]
  )

  const handleMouseMove = useCallback(
    ({ clientX, clientY }) => {
      const delta = [clientX - state.origin[0], clientY - state.origin[1]]
      const res = onDrag ? onDrag({ delta }) : null
      if (res) setState(state => ({ ...state, delta: res }))
      else setState(state => ({ ...state, delta }))
    },
    [state.origin, onDrag]
  )

  const handleMouseUp = useCallback(() => {
    setState(state => ({ ...state, isDragging: false, delta: [0, 0] }))
    if (onDragEnd) onDragEnd({ delta: state.delta })
  }, [onDragEnd, state.delta])

  useEffect(() => {
    if (state.isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [state.isDragging, handleMouseMove, handleMouseUp])

  const styles = useMemo(
    () => ({
      cursor: state.isDragging ? '-webkit-grabbing' : '-webkit-grab',
      transform: `translate(${position[0] + state.delta[0]}px, ${
        position[1] + state.delta[1]
      }px)`,
      zIndex: state.isDragging ? 2 : null,
      position: state.isDragging ? 'absolute' : 'relative'
    }),
    [position, state.isDragging, state.delta]
  )

  return (
    <div style={styles} onMouseDown={handleMouseDown}>
      {children}
    </div>
  )
}

export default Draggable