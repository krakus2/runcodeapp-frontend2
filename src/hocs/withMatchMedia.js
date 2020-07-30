import React from 'react'

import { useMatchMedia } from 'hooks'

const withMatchMedia = (Component) => (props) => {
  const { isMobile } = useMatchMedia()

  return <Component {...props} isMobile={isMobile} />
}

export default withMyHook
