import inject from 'seacreature/lib/inject'

inject('pod', () => {
  inject('404', () => {
    return <div>Orders Page</div>
  })
})
