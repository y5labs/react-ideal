import inject from 'seacreature/lib/inject'
import { createContext, useContext, useEffect, useState } from 'react'

inject('pod', ({ hub, StateContext, StateProvider }) => {
  const Display = () => {
    const state = useContext(StateContext)
    // Use the Consumer to grab the value from context
    // Notice this component didn't get any props!
    return (
      <div>The answer is {state.number}. <button onClick={ state.increment }>+</button></div>
    )
  }

  const App = () => {
    // Use the Provider to make a value available to all
    // children and grandchildren
    return (
      <StateProvider>
        <div>
          <Display />
        </div>
      </StateProvider>
    )
  }

  inject('app', App)
})
