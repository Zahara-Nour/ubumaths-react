import React, { useState } from 'react'
import LazyLoad from 'react-lazyload'
import { Transition } from 'react-transition-group'

function FadeIn({ height, children }) {
  const duration = 1000

  const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
  }

  const transitionStyles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
  }

  const [loaded, setLoaded] = useState(false)
  const onLoad = () => setLoaded(true)

  return (
    <LazyLoad height={height} offset={150}>
      <Transition in={loaded} timeout={duration}>
        {(state) => (
          <div
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
          >
            {children(onLoad)}
          </div>
        )}
      </Transition>
    </LazyLoad>
  )
}

export default FadeIn
