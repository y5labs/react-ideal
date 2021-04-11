import inject from 'seacreature/lib/inject'
import { createContext, useEffect, useState } from 'react'

inject('ctx', ({ hub }) => {
  const StateContext = createContext()

  const StateProvider = ({ children }) => {
    const [state, setState] = useState({
      number: 43
    })
    return <StateContext.Provider
      value={state} children={children} />
  }
  return { StateContext, StateProvider }
})