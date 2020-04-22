import React from 'react'

import './CircularProgressBar.css'
export default function CircularProgressBar({
  number,
  fontSize,
  strokeWidth,
  percentage,
}) {
  // Size of the enclosing square
  // SVG centers the stroke width on the radius, subtract out so circle fits in square
  //   const sqSize = sqSize
  const sqSize = fontSize * 1.8
 

  const radius = (sqSize - strokeWidth) / 2
  // Enclose cicle in a circumscribing square
  const viewBox = `0 0 ${sqSize} ${sqSize}`
  // Arc length at 100% coverage is the circle circumference
  const dashArray = radius * Math.PI * 2
  // Scale 100% coverage overlay with the actual percent
  const dashOffset = dashArray - (dashArray * percentage) / 100

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        textAlign: 'center',
      }}
    >
      <svg width={sqSize} height={sqSize} viewBox={viewBox}>
        <circle
          className='circle-background'
          cx={sqSize / 2}
          cy={sqSize / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
        />
        <circle
          className='circle-progress'
          cx={sqSize / 2}
          cy={sqSize / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
          // Start progress marker at 12 O'Clock
          transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
          style={{
            strokeDasharray: dashArray,
            strokeDashoffset: dashOffset,
          }}
        />
      </svg>
      <div
        style={{
          fontSize: fontSize,
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {number}
      </div>
    </div>
  )
}
