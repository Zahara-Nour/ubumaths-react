import { containerFluid } from 'assets/jss/main-jss.js'

const appStyle = (theme) => ({
  ubu: {
    '&:hover': {
      animation: `$shake 0.8s infinite ${theme.transitions.easing.easeInOut}`,
    },
  },

  '@keyframes shake': {
    '0%': { transform: 'translate(1px, 1px) rotate(0deg)' },
    '10%': { transform: 'translate(-1px, -2px) rotate(-1deg)' },
    '20%': { transform: 'translate(-3px, 0px) rotate(1deg)' },
    '30%': { transform: 'translate(3px, 2px) rotate(0deg)' },
    '40%': { transform: 'translate(1px, -1px) rotate(1deg)' },
    '50%': { transform: 'translate(-1px, 2px) rotate(-1deg)' },
    '60%': { transform: 'translate(-3px, 1px) rotate(0deg)' },
    '70%': { transform: 'translate(3px, 1px) rotate(-1deg)' },
    '80%': { transform: 'translate(-1px, -1px) rotate(1deg)' },
    '90%': { transform: 'translate(1px, 2px) rotate(0deg)' },
    '100%': { transform: 'translate(1px, -2px) rotate(-1deg)' },
  },
  wrapper: {
    position: 'relative',
    top: '0',
    height: '100vh',
    '&:after': {
      display: 'table',
      clear: 'both',
      content: '" "',
    },
  },
  content: {
    minHeight: 'calc(100vh - 180px)',
  },
  container: { ...containerFluid },
})

export default appStyle
