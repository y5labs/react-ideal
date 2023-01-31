import inject from 'seacreature/lib/inject'
import { render } from 'react-dom'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

const { VITE_SENTRY_SECRET_KEY, VITE_SENTRY_HOST, VITE_SENTRY_PROJECT_ID, VITE_SENTRY_TRACE_SAMPLE_RATE } = import.meta
  .env

if (VITE_SENTRY_SECRET_KEY && VITE_SENTRY_HOST && VITE_SENTRY_PROJECT_ID)
  Sentry.init({
    dsn: `https://${VITE_SENTRY_SECRET_KEY}@${VITE_SENTRY_HOST}/${VITE_SENTRY_PROJECT_ID}`,
    integrations: [new BrowserTracing()],
    tracesSampleRate: VITE_SENTRY_TRACE_SAMPLE_RATE ?? 1
  })
else console.warn('Sentry is not configured.')

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
