import inject from 'seacreature/lib/inject'
import { useContext } from 'react'

inject('pod', ({ StateContext, HubContext }) => {
  const App = () => {
    const state = useContext(StateContext)
    const hub = useContext(HubContext)

    const increment = e => {
      e.preventDefault()
      hub.emit('increment')
    }

    return (
      <div>
        {state.time}: The answer is {state.number}.
        <button onClick={increment}>+</button>
      </div>
    )
  }

  inject('app', App)
})
