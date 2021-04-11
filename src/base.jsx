import inject from 'seacreature/lib/inject'
import { useContext } from 'react'

inject('pod', ({ RouterContext }) => {
  const App = () => {
    const Route = useContext(RouterContext)
    const NotFound = inject.one('404')

    return (
      <div>
        <nav>
          <div><a href="/">Home</a></div>
          <div><a href="/orders">Orders</a></div>
        </nav>
        <div>
          {Route ? <Route /> : <NotFound />}
        </div>
      </div>
    )
  }

  inject('app', App)
})