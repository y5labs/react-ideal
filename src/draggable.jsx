import { useState, useCallback, useMemo, useEffect } from 'react'

const Draggable = ({
  position = [0, 0],
  children,
  onDragStart,
  onDrag,
  onDragEnd,
  onTap
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
        isDown: true,
        origin: [e.clientX, e.clientY]
      }))
      e.stopPropagation()
    },
    []
  )

  const handleMouseMove = useCallback(
    ({ clientX, clientY }) => {
      const delta = [clientX - state.origin[0], clientY - state.origin[1]]
      const wasDragging = state.isDragging
      const isDragging = state.isDragging || Math.abs(delta[0]) > 10 || Math.abs(delta[1]) > 10
      if (!isDragging) return
      if (!wasDragging && onDragStart) onDragStart({ clientX, clientY })
      const res = onDrag ? onDrag({ delta }) : null
      if (res) setState(state => ({ ...state, delta: res, isDragging: true }))
      else setState(state => ({ ...state, isDragging: true, delta }))
    },
    [state.origin, state.isDragging, onDrag]
  )

  const handleMouseUp = useCallback(() => {
    const isDragging = state.isDragging
    setState(state => ({ ...state, isDown: false, isDragging: false, delta: [0, 0] }))
    if (!isDragging && onTap) onTap()
    if (isDragging && onDragEnd) onDragEnd({ delta: state.delta })
  }, [onDragEnd, onTap, state.isDragging, state.delta])

  useEffect(() => {
    if (state.isDown) {
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
  }, [state.isDown, handleMouseMove, handleMouseUp])

  const styles = useMemo(
    () => ({
      transform: `translate(${position[0] + state.delta[0]}px, ${
        position[1] + state.delta[1]
      }px)`,
      zIndex: state.isDragging ? 100 : null,
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