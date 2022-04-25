import { useState, useCallback, useMemo, useEffect } from 'react'

const istouch =
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0

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

  const handleTouchStart = useCallback(e => {
    setState(state => ({
      ...state,
      isDown: true,
      origin: [e.touches[0].clientX, e.touches[0].clientY]
    }))
    e.stopPropagation()
  }, [])

  const handleTouchMove = useCallback(
    e => {
      const clientX = e.touches[0].clientX
      const clientY = e.touches[0].clientY
      const delta = [clientX - state.origin[0], clientY - state.origin[1]]
      const wasDragging = state.isDragging
      const isDragging =
        state.isDragging || Math.abs(delta[0]) > 10 || Math.abs(delta[1]) > 10
      if (!isDragging) return
      if (!wasDragging && onDragStart) onDragStart({ clientX, clientY })
      const res = onDrag ? onDrag({ delta }) : null
      if (res) setState(state => ({ ...state, delta: res, isDragging: true }))
      else setState(state => ({ ...state, isDragging: true, delta }))
    },
    [state.origin, state.isDragging, onDrag]
  )

  const handleTouchEnd = useCallback(() => {
    const isDragging = state.isDragging
    setState(state => ({
      ...state,
      isDown: false,
      isDragging: false,
      delta: [0, 0]
    }))
    if (!isDragging && onTap) onTap()
    if (isDragging && onDragEnd) onDragEnd({ delta: state.delta })
  }, [onDragEnd, onTap, state.isDragging, state.delta])

  const handleMouseDownStop = e => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleMouseDown = useCallback(e => {
    setState(state => ({
      ...state,
      isDown: true,
      origin: [e.clientX, e.clientY]
    }))
    e.stopPropagation()
  }, [])

  const handleMouseMove = useCallback(
    ({ clientX, clientY }) => {
      const delta = [clientX - state.origin[0], clientY - state.origin[1]]
      const wasDragging = state.isDragging
      const isDragging =
        state.isDragging || Math.abs(delta[0]) > 10 || Math.abs(delta[1]) > 10
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
    setState(state => ({
      ...state,
      isDown: false,
      isDragging: false,
      delta: [0, 0]
    }))
    if (!isDragging && onTap) onTap()
    if (isDragging && onDragEnd) onDragEnd({ delta: state.delta })
  }, [onDragEnd, onTap, state.isDragging, state.delta])

  useEffect(() => {
    if (state.isDown) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleTouchEnd)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [
    state.isDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd
  ])

  const styles = useMemo(
    () => ({
      transform: `translate(${position[0] + state.delta[0]}px, ${
        position[1] + state.delta[1]
      }px)`,
      zIndex: state.isDragging ? 100 : null,
      position: state.isDragging ? 'absolute' : 'relative',
      touchAction: 'none'
    }),
    [position, state.isDragging, state.delta]
  )

  return (
    <div
      style={styles}
      {...(istouch
        ? {
          onTouchStart: handleTouchStart,
          onMouseDown: handleMouseDownStop
        }
        : {
            onMouseDown: handleMouseDown
          })}
    >
      {children}
    </div>
  )
}

export default Draggable
