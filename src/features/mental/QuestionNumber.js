import React from 'react'

// const questionNumberStyle = {
//     color: '#fff',
//     display: 'inline-block',
//     padding: '0.5em',
//     marginRight: '1em',
//     fontSize: '50px',
//     background: '#A872B2',
//     width: '0.7em',
//     height: '0.7em',
//     boxSizing: 'initial',
//     textAlign: 'center',
//     borderRadius: '50%',
//     lineHeight: '0.7em',
//     // boxSizing:'contentBox'
//   }

// export default function QuestionNumber({number}) {

//     return (
//         <span style= {questionNumberStyle}>
//         {number}
//         </span>
//     )
// }
import  { successColor } from 'assets/jss/main-jss'
export default function QuestionNumber({ number, fontSize }) {
  // Size of the enclosing square
  // SVG centers the stroke width on the radius, subtract out so circle fits in square
  //   const sqSize = sqSize
  const sqSize = fontSize * 1.3

  const radius = sqSize / 2
  // Enclose cicle in a circumscribing square
  const viewBox = `0 0 ${sqSize} ${sqSize}`
  // Arc length at 100% coverage is the circle circumference
  console.log('qestion')
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        margin:'15px'
      }}
    >
      <svg width={sqSize} height={sqSize} viewBox={viewBox}>
        <circle cx={sqSize / 2} cy={sqSize / 2} r={radius} fill={successColor[3]} />
      </svg>
      <div
        style={{
            color:'white',
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
