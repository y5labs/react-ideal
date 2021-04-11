import inject from 'seacreature/lib/inject'
import { createContext, useContext, useEffect, useState } from 'react'

inject('ctx', ({ HubContext }) => {
  const StateContext = createContext()

  const StateProvider = ({ children }) => {
    const hub = useContext(HubContext)

    const [state, setState] = useState({
      number: 43
    })

    hub.on('increment', () => {
      setState({
        ...state,
        number: state.number + 1
      })
    })

    return <StateContext.Provider
      value={state} children={children} />
  }
  return { StateContext, StateProvider }
})