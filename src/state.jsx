import inject from 'seacreature/lib/inject'
import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

inject('ctx', ({ HubContext }) => {
  const StateContext = createContext()

  const StateProvider = ({ children }) => {
    // initial values
    const [state, setState] = useState({
      number: 43,
      time: new Date().valueOf()
    })

    const hub = useContext(HubContext)

    useEffect(hub.effect(hub => {
      hub.on('increment', () => {
        setState(state => ({
          ...state,
          number: state.number + 1
        }))
      })

      const handle = setInterval(() => {
        setState(state => ({
          ...state,
          time: new Date().valueOf()
        }))
      }, 1000)

      return () => {
        clearInterval(handle)
      }
    }), [state])
    // [state] is important: subscribe to changes in state

    return <StateContext.Provider
      value={state} children={children} />
  }

  inject('provider', StateProvider)

  return { StateContext, StateProvider }
})