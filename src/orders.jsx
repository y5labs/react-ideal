import inject from 'seacreature/lib/inject'

inject('pod', () => {
  const Orders = () => {
    return <div>Orders Page</div>
  }

  inject('route', ['/orders', p => Orders])
})
