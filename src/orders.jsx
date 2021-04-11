import inject from 'seacreature/lib/inject'

inject('pod', () => {
  inject('route', ['/orders', p => () => {
    return <div>Orders Page</div>
  }])
})
