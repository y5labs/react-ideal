import { DateTime } from 'luxon'

// Static data and functions
const col_width = 120
const row_height = 26

const nice_pos = pos => Math.round(pos * 100) / 100

const range = (start, end) =>
  Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx)
// TODO: leap year improvement?
const month_days = range(0, 11).map(n => {
  const start_at = DateTime.fromISO('2020-01-01').plus({ months: n })
  const end_at = start_at.plus({ months: 1 })
  return end_at.diff(start_at, 'days').as('days')
})
const month_offset_start = d =>
  nice_pos(((d.day - 1) / month_days[d.month - 1]) * col_width)
const month_offset_end = d => nice_pos((d.day / month_days[d.month - 1]) * col_width)

const month = ({ selectedIndex, time_dims, task_dims, get_data }) => {
  const start_at = time_dims[0].startOf('month')
  const time_axis_size =
    time_dims[1]
      .startOf('month')
      .diff(start_at, ['months'])
      .as('months') + 1
  const offset_to_time = n => {
    const d = start_at.plus({ months: n })
    return d.toFormat('MMM yy')
  }
  const time_window = dims => range(dims[0], dims[1]).map(offset_to_time)

  const task_axis_size = task_dims[1] - task_dims[0] + 1
  const offset_to_task = n => get_data([n, n + 1])[0].name
  const task_window = dims => range(dims[0], dims[1]).map(offset_to_task)

  const cache = {}
  const assert = (r, c, fn) => {
    if (!cache[r]) cache[r] = {}
    if (!cache[r][c]) cache[r][c] = fn()
    return cache[r][c]
  }

  const schedule_window = (row_dims, col_dims) => {
    const items = range(row_dims[0], row_dims[1]).map(r =>
      range(col_dims[0], col_dims[1]).map(i => cache?.[r]?.[i])
    )

    const filtered_tasks = get_data(row_dims).map((t, i) => ({ t, i }))
    for (const { t, i } of filtered_tasks) {
      if (!t.start_at | !t.end_at) continue
      const oi = i + row_dims[0]

      const task_dims = [
        t.start_at
          .startOf('month')
          .diff(start_at, ['months'])
          .as('months'),
        t.end_at.startOf('month').diff(start_at, ['months']).as('months')
      ]

      const start_n = task_dims[0] - col_dims[0]
      const row_items = items[i]
      const standard = {
        t,
        i: oi,
        s: selectedIndex == oi
      }
      if (task_dims[0] == task_dims[1]) {
        if (!row_items[start_n])
          row_items[start_n] = assert(oi, task_dims[0], () => ({
            ...standard,
            type: 'startandend',
            start: month_offset_start(t.start_at),
            end: month_offset_end(t.end_at)
          }))
      } else {
        const end_n = task_dims[1] - col_dims[0]
        const offset = [month_offset_start(t.start_at), month_offset_end(t.end_at)]
        if (!row_items[start_n])
          row_items[start_n] = assert(oi, task_dims[0], () => ({
            ...standard,
            type: 'start',
            start: offset[0],
            end: (end_n - start_n) * col_width + offset[1]
          }))
        if (!row_items[end_n])
          row_items[end_n] = assert(oi, task_dims[1], () => ({
            ...standard,
            type: 'end',
            start: (start_n - end_n) * col_width + offset[0],
            end: offset[1]
          }))
        if (end_n - start_n > 1)
          for (const n of range(start_n + 1, end_n - 1))
            if (!row_items[n])
              row_items[n] = assert(oi, n + col_dims[0], () => ({
                ...standard,
                type: 'middle',
                start: (start_n - n) * col_width + offset[0],
                end: (end_n - n) * col_width + offset[1]
              }))
      }
    }

    return items
  }

  const calc_move = ({ task, index, delta }) => {
    const months = delta[0] / col_width
    return [
      task.start_at.plus({ months }),
      task.end_at.plus({ months })
    ]
  }

  const calc_move_start = ({ task, index, delta }) => {
    const months = delta[0] / col_width
    const new_start_at = task.start_at.plus({ months })
    return [
      new_start_at,
      task.end_at < new_start_at ? new_start_at : task.end_at
    ]
  }

  const calc_move_end = ({ task, index, delta }) => {
    const months = delta[0] / col_width
    const new_end_at =  task.end_at.plus({ months })

    return [
      new_end_at < task.start_at ? new_end_at : task.start_at,
      new_end_at
    ]
  }

  return {
    time_axis_size,
    time_window,
    task_axis_size,
    task_window,
    schedule_window,
    calc_move,
    calc_move_start,
    calc_move_end
  }
}

const quarter = ({ selectedIndex, time_dims, task_dims, get_data }) => {
  const start_at = time_dims[0].startOf('month')
  const time_axis_size =
    time_dims[1]
      .startOf('month')
      .diff(start_at, ['months'])
      .as('months') + 1
  const offset_to_time = n => {
    const d = start_at.plus({ months: n })
    return d.toFormat('MMM yy')
  }
  const time_window = dims => range(dims[0], dims[1]).map(offset_to_time)

  const task_axis_size = task_dims[1] - task_dims[0] + 1
  const offset_to_task = n => get_data([n, n + 1])[0].name
  const task_window = dims => range(dims[0], dims[1]).map(offset_to_task)

  const cache = {}
  const assert = (r, c, fn) => {
    if (!cache[r]) cache[r] = {}
    if (!cache[r][c]) cache[r][c] = fn()
    return cache[r][c]
  }

  const schedule_window = (row_dims, col_dims) => {
    const items = range(row_dims[0], row_dims[1]).map(r =>
      range(col_dims[0], col_dims[1]).map(i => cache?.[r]?.[i])
    )

    const filtered_tasks = get_data(row_dims).map((t, i) => ({ t, i }))
    for (const { t, i } of filtered_tasks) {
      if (!t.start_at | !t.end_at) continue
      const oi = i + row_dims[0]

      const task_dims = [
        t.start_at
          .startOf('month')
          .diff(start_at, ['months'])
          .as('months'),
        t.end_at.startOf('month').diff(start_at, ['months']).as('months')
      ]

      const start_n = task_dims[0] - col_dims[0]
      const row_items = items[i]
      const standard = {
        t,
        i: oi,
        s: selectedIndex == oi
      }
      if (task_dims[0] == task_dims[1]) {
        if (!row_items[start_n])
          row_items[start_n] = assert(oi, task_dims[0], () => ({
            ...standard,
            type: 'startandend',
            start: month_offset_start(t.start_at),
            end: month_offset_end(t.end_at)
          }))
      } else {
        const end_n = task_dims[1] - col_dims[0]
        const offset = [month_offset_start(t.start_at), month_offset_end(t.end_at)]
        if (!row_items[start_n])
          row_items[start_n] = assert(oi, task_dims[0], () => ({
            ...standard,
            type: 'start',
            start: offset[0],
            end: (end_n - start_n) * col_width + offset[1]
          }))
        if (!row_items[end_n])
          row_items[end_n] = assert(oi, task_dims[1], () => ({
            ...standard,
            type: 'end',
            start: (start_n - end_n) * col_width + offset[0],
            end: offset[1]
          }))
        if (end_n - start_n > 1)
          for (const n of range(start_n + 1, end_n - 1))
            if (!row_items[n])
              row_items[n] = assert(oi, n + col_dims[0], () => ({
                ...standard,
                type: 'middle',
                start: (start_n - n) * col_width + offset[0],
                end: (end_n - n) * col_width + offset[1]
              }))
      }
    }

    return items
  }

  const calc_move = ({ task, index, delta }) => {
    const months = delta[0] / col_width
    return [
      task.start_at.plus({ months }),
      task.end_at.plus({ months })
    ]
  }

  const calc_move_start = ({ task, index, delta }) => {
    const months = delta[0] / col_width
    const new_start_at = task.start_at.plus({ months })
    return [
      new_start_at,
      task.end_at < new_start_at ? new_start_at : task.end_at
    ]
  }

  const calc_move_end = ({ task, index, delta }) => {
    const months = delta[0] / col_width
    const new_end_at =  task.end_at.plus({ months })

    return [
      new_end_at < task.start_at ? new_end_at : task.start_at,
      new_end_at
    ]
  }

  return {
    time_axis_size,
    time_window,
    task_axis_size,
    task_window,
    schedule_window,
    calc_move,
    calc_move_start,
    calc_move_end
  }
}
const year = ({ selectedIndex, time_dims, task_dims, get_data }) => {
  const start_at = time_dims[0].startOf('month')
  const time_axis_size =
    time_dims[1]
      .startOf('month')
      .diff(start_at, ['months'])
      .as('months') + 1
  const offset_to_time = n => {
    const d = start_at.plus({ months: n })
    return d.toFormat('MMM yy')
  }
  const time_window = dims => range(dims[0], dims[1]).map(offset_to_time)

  const task_axis_size = task_dims[1] - task_dims[0] + 1
  const offset_to_task = n => get_data([n, n + 1])[0].name
  const task_window = dims => range(dims[0], dims[1]).map(offset_to_task)

  const cache = {}
  const assert = (r, c, fn) => {
    if (!cache[r]) cache[r] = {}
    if (!cache[r][c]) cache[r][c] = fn()
    return cache[r][c]
  }

  const schedule_window = (row_dims, col_dims) => {
    const items = range(row_dims[0], row_dims[1]).map(r =>
      range(col_dims[0], col_dims[1]).map(i => cache?.[r]?.[i])
    )

    const filtered_tasks = get_data(row_dims).map((t, i) => ({ t, i }))
    for (const { t, i } of filtered_tasks) {
      if (!t.start_at | !t.end_at) continue
      const oi = i + row_dims[0]

      const task_dims = [
        t.start_at
          .startOf('month')
          .diff(start_at, ['months'])
          .as('months'),
        t.end_at.startOf('month').diff(start_at, ['months']).as('months')
      ]

      const start_n = task_dims[0] - col_dims[0]
      const row_items = items[i]
      const standard = {
        t,
        i: oi,
        s: selectedIndex == oi
      }
      if (task_dims[0] == task_dims[1]) {
        if (!row_items[start_n])
          row_items[start_n] = assert(oi, task_dims[0], () => ({
            ...standard,
            type: 'startandend',
            start: month_offset_start(t.start_at),
            end: month_offset_end(t.end_at)
          }))
      } else {
        const end_n = task_dims[1] - col_dims[0]
        const offset = [month_offset_start(t.start_at), month_offset_end(t.end_at)]
        if (!row_items[start_n])
          row_items[start_n] = assert(oi, task_dims[0], () => ({
            ...standard,
            type: 'start',
            start: offset[0],
            end: (end_n - start_n) * col_width + offset[1]
          }))
        if (!row_items[end_n])
          row_items[end_n] = assert(oi, task_dims[1], () => ({
            ...standard,
            type: 'end',
            start: (start_n - end_n) * col_width + offset[0],
            end: offset[1]
          }))
        if (end_n - start_n > 1)
          for (const n of range(start_n + 1, end_n - 1))
            if (!row_items[n])
              row_items[n] = assert(oi, n + col_dims[0], () => ({
                ...standard,
                type: 'middle',
                start: (start_n - n) * col_width + offset[0],
                end: (end_n - n) * col_width + offset[1]
              }))
      }
    }

    return items
  }

  const calc_move = ({ task, index, delta }) => {
    const months = delta[0] / col_width
    return [
      task.start_at.plus({ months }),
      task.end_at.plus({ months })
    ]
  }

  const calc_move_start = ({ task, index, delta }) => {
    const months = delta[0] / col_width
    const new_start_at = task.start_at.plus({ months })
    return [
      new_start_at,
      task.end_at < new_start_at ? new_start_at : task.end_at
    ]
  }

  const calc_move_end = ({ task, index, delta }) => {
    const months = delta[0] / col_width
    const new_end_at =  task.end_at.plus({ months })

    return [
      new_end_at < task.start_at ? new_end_at : task.start_at,
      new_end_at
    ]
  }

  return {
    time_axis_size,
    time_window,
    task_axis_size,
    task_window,
    schedule_window,
    calc_move,
    calc_move_start,
    calc_move_end
  }
}

export {
  month,
  quarter,
  year,
  col_width,
  row_height
}