import inject from 'seacreature/lib/inject'

inject('pod', () => {
  inject('404', () => {
    return <div>404 / Page not found</div>
  })
})
