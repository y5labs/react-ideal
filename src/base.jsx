import inject from 'seacreature/lib/inject'
import { useContext } from 'react'

inject('pod', ({ RouterContext }) => {
  inject('app', () => {
    const Route = useContext(RouterContext)
    const NotFound = inject.one('404')

    return (
      <>
        <article>{Route ? <Route /> : <NotFound />}</article>
      </>
    )
  })
})
