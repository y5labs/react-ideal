import inject from 'seacreature/lib/inject'
import Hub from 'seacreature/lib/hub'
import { createContext, useEffect, useState } from 'react'

inject('ctx', () => {
  const hub = Hub()
  const log = (...args) => hub.emit('log', ...args)
  log.error = (...args) => hub.emit('error', ...args)
  hub.on('log', (...args) => console.log(...args))
  hub.on('error', (...args) => console.error(...args))

  const HubContext = createContext()

  const HubProvider = props => {
    const { children } = props
    const child_hub = props.hub ? props.hub : hub.child()
    return <HubContext.Provider
      value={child_hub} children={children} />
  }

  return { hub, log, HubContext, HubProvider }
})
