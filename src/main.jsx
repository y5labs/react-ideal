import inject from 'seacreature/lib/inject'
import { useContext } from 'react'

inject('pod', ({ StateContext, HubContext }) => {
  inject('route', ['/', p => () => {
    const state = useContext(StateContext)
    const hub = useContext(HubContext)

    const increment = e => {
      e.preventDefault()
      hub.emit('increment')
    }

    return (
      <>
        {state.time}: The answer is {state.number}.<button onClick={increment}>+</button>
        <hr />
        <button onClick={() => undefinedFunction()}>Sentry Test</button>
      </>
    )
  }])
})
