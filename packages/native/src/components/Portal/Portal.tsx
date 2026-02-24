import React, { useState, useEffect } from 'react'

let portalContainer: { [key: string]: React.ReactNode } = {}
let updateListeners: { [key: string]: (() => void)[] } = {}

export interface PortalProps {
  /** Portal name */
  name?: string
  /** Children to render in portal */
  children: React.ReactNode
}

export const Portal: React.FC<PortalProps> = ({ name = 'default', children }) => {
  useEffect(() => {
    portalContainer[name] = children
    updateListeners[name]?.forEach(listener => listener())

    return () => {
      delete portalContainer[name]
      updateListeners[name]?.forEach(listener => listener())
    }
  }, [children, name])

  return null
}

Portal.displayName = 'Portal'

export interface PortalHostProps {
  /** Portal host name */
  name?: string
}

export const PortalHost: React.FC<PortalHostProps> = ({ name = 'default' }) => {
  const [, setUpdate] = useState(0)

  useEffect(() => {
    const listener = () => setUpdate(prev => prev + 1)
    if (!updateListeners[name]) {
      updateListeners[name] = []
    }
    updateListeners[name].push(listener)

    return () => {
      updateListeners[name] = updateListeners[name].filter(l => l !== listener)
    }
  }, [name])

  return <>{portalContainer[name] || null}</>
}

PortalHost.displayName = 'PortalHost'
