import React from 'react'

export default function EventJail(props) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        console.log('event trapped')
      }}
    >
      {props.children}
    </div>
  )
}
