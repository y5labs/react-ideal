import inject from 'seacreature/lib/inject'
import { render } from 'react-dom'

inject('pod', async () => {
  const App = inject.one('app')
  render(<App />, document.getElementById('root'))
})
