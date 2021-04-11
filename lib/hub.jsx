import inject from 'seacreature/lib/inject'
import Hub from 'seacreature/lib/hub'
import { createContext } from 'react'

inject('ctx', () => {
  const hub = Hub()
  const HubContext = createContext()

  const HubProvider = props => {
    const { children } = props
    const child_hub = props.hub ? props.hub : hub
    return <HubContext.Provider
      value={child_hub} children={children} />
  }

  inject('provider', HubProvider)

  return { hub, HubContext, HubProvider }
})
