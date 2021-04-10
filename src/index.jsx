import inject from 'seacreature/lib/inject'
import { render } from 'react-dom'
import HelloWorld from './hello-world'

inject('pod', async () => {
  render(<HelloWorld />, document.getElementById('root'))
})
