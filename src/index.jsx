import inject from 'seacreature/lib/inject'
import { useContext } from 'react'

inject('pod', ({ RouterContext, StateContext, HubContext }) => {
  const App = () => {
    const state = useContext(StateContext)
    const hub = useContext(HubContext)
    const Route = useContext(RouterContext)

    const increment = e => {
      e.preventDefault()
      hub.emit('increment')
    }

    return (
      <div>
        <nav>
          <div><a href="/">Home</a></div>
          <div><a href="/orders">Orders</a></div>
        </nav>
        <div>
          {Route ? <Route /> : null}
        </div>
      </div>
    )
  }

  inject('app', App)
})