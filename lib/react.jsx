import inject from 'seacreature/lib/inject'
import { render } from 'react-dom'

inject('pod', async () => {
  const App = inject.one('app')
  const Root = () =>
    inject.many('provider')
      .reverse()
      .reduce((children, Provider) =>
        <Provider children={children} />,
        <App />)
  render(<Root />, document.getElementById('root'))
})

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (undefined /* [snowpack] import.meta.hot */ ) {
  undefined /* [snowpack] import.meta.hot */ .accept();
}