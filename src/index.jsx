import inject from 'seacreature/lib/inject'

inject('pod', ({ hub, StateProvider, HubProvider }) => {
  const providers = [
    HubProvider,
    StateProvider
  ]

  const Display = inject.one('display')

  const App = () =>
    providers.reverse().reduce((children, Provider) =>
      <Provider children={children} />,
      <Display />
    )

  inject('app', App)
})
