import inject from 'seacreature/lib/inject'
import { useContext } from 'react'

inject('pod', ({ RouterContext }) => {
  inject('app', () => {
    const Route = useContext(RouterContext)
    const NotFound = inject.one('404')

    return (
      <div>
        <nav>
          <div><a href="/">Home</a></div>
          <div><a href="/orders">Orders</a></div>
        </nav>
        <article>
          {Route ? <Route /> : <NotFound />}
        </article>
      </div>
    )
  })
})