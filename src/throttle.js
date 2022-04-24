const throttle = (fn, ms) => {
  let t = null
  let arg_top = null
  let arg_left = null
  return (top, left) => {
    if (top != null) arg_top = top
    if (left != null) arg_left = left
    if (!t) {
      t = setTimeout(() => {
        t = null
        fn(arg_top, arg_left)
      }, ms)
    }
  }
}

export default throttle