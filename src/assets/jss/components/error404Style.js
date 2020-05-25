
  const error404Style = (theme) => ({
    '@keyframes spin': {
      from: { transform:'rotate(0deg)' },
      to: { transform:'rotate(360deg)' },
    },
    'pi-spiral': {
      animation: '$spin infinite 20s linear',
    },
 
  })
  
  export default error404Style
  