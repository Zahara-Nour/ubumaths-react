// ##############################
// // // Function that converts from hex color to rgb color
// // // Example: input = #9c27b0 => output = 156, 39, 176
// // // Example: input = 9c27b0 => output = 156, 39, 176
// // // Example: input = #999 => output = 153, 153, 153
// // // Example: input = 999 => output = 153, 153, 153
// #############################
const hexToRgb = (input) => {
  input = input + ''
  input = input.replace('#', '')
  let hexRegex = /[0-9A-Fa-f]/g
  if (!hexRegex.test(input) || (input.length !== 3 && input.length !== 6)) {
    throw new Error('input is not a valid hex color.')
  }
  if (input.length === 3) {
    let first = input[0]
    let second = input[1]
    let last = input[2]
    input = first + first + second + second + last + last
  }
  input = input.toUpperCase(input)
  let first = input[0] + input[1]
  let second = input[2] + input[3]
  let last = input[4] + input[5]
  return (
    parseInt(first, 16) +
    ', ' +
    parseInt(second, 16) +
    ', ' +
    parseInt(last, 16)
  )
}

// ##############################
// // // Variables - Styles that are used on more than one component
// #############################

const drawerWidth = 260

const drawerMiniWidth = 80

const transition = {
  transition: 'all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)',
}

const containerFluid = {
  paddingRight: '15px',
  paddingLeft: '15px',
  marginRight: 'auto',
  marginLeft: 'auto',
  '&:before,&:after': {
    display: 'table',
    content: '" "',
  },
  '&:after': {
    clear: 'both',
  },
}

const container = {
  paddingRight: '15px',
  paddingLeft: '15px',
  marginRight: 'auto',
  marginLeft: 'auto',
  '@media (min-width: 768px)': {
    width: '750px',
  },
  '@media (min-width: 992px)': {
    width: '970px',
  },
  '@media (min-width: 1200px)': {
    width: '1170px',
  },
  '&:before,&:after': {
    display: 'table',
    content: '" "',
  },
  '&:after': {
    clear: 'both',
  },
}

const defaultFont = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontWeight: '300',
  lineHeight: '1.5em',
}

const primaryColor = ['#9c27b0', '#ab47bc', '#8e24aa', '#af2cc5', '#7b1fa2']
const secondaryColor = ['#fafafa']
const warningColor = [
  '#ff9800',
  '#ffa726',
  '#fb8c00',
  '#ffa21a',
  '#f57c00',
  '#faf2cc',
  '#fcf8e3',
]
const dangerColor = [
  '#f44336',
  '#ef5350',
  '#e53935',
  '#f55a4e',
  '#d32f2f',
  '#ebcccc',
  '#f2dede',
]
const successColor = [
  '#4caf50',
  '#66bb6a',
  '#43a047',
  '#5cb860',
  '#388e3c',
  '#d0e9c6',
  '#dff0d8',
]
const infoColor = [
  '#00acc1',
  '#26c6da',
  '#00acc1',
  '#00d3ee',
  '#0097a7',
  '#c4e3f3',
  '#d9edf7',
]
const roseColor = ['#e91e63', '#ec407a', '#d81b60', '#eb3573', '#c2185b']
const grayColor = [
  '#999',
  '#777',
  '#3C4858',
  '#AAAAAA',
  '#D2D2D2',
  '#DDD',
  '#555555',
  '#333',
  '#eee',
  '#ccc',
  '#e4e4e4',
  '#E5E5E5',
  '#f9f9f9',
  '#f5f5f5',
  '#495057',
  '#e7e7e7',
  '#212121',
  '#c8c8c8',
  '#505050',
]
const blackColor = '#000'
const whiteColor = '#FFF'
const twitterColor = '#55acee'
const facebookColor = '#3b5998'
const googleColor = '#dd4b39'
const linkedinColor = '#0976b4'
const pinterestColor = '#cc2127'
const youtubeColor = '#e52d27'
const tumblrColor = '#35465c'
const behanceColor = '#1769ff'
const dribbbleColor = '#ea4c89'
const redditColor = '#ff4500'
const instagramColor = '#125688'
const firebaseColor = '#FFCA28'
const reactColor = '#61DBFB'

const boxShadow = {
  boxShadow:
    '0 10px 30px -12px rgba(' +
    hexToRgb(blackColor) +
    ', 0.42), 0 4px 25px 0px rgba(' +
    hexToRgb(blackColor) +
    ', 0.12), 0 8px 10px -5px rgba(' +
    hexToRgb(blackColor) +
    ', 0.2)',
}

const primaryBoxShadow = {
  boxShadow:
    '0 4px 20px 0 rgba(' +
    hexToRgb(blackColor) +
    ',.14), 0 7px 10px -5px rgba(' +
    hexToRgb(primaryColor[0]) +
    ',.4)',
}
const infoBoxShadow = {
  boxShadow:
    '0 4px 20px 0 rgba(' +
    hexToRgb(blackColor) +
    ',.14), 0 7px 10px -5px rgba(' +
    hexToRgb(infoColor[0]) +
    ',.4)',
}
const successBoxShadow = {
  boxShadow:
    '0 4px 20px 0 rgba(' +
    hexToRgb(blackColor) +
    ',.14), 0 7px 10px -5px rgba(' +
    hexToRgb(successColor[0]) +
    ',.4)',
}
const warningBoxShadow = {
  boxShadow:
    '0 4px 20px 0 rgba(' +
    hexToRgb(blackColor) +
    ',.14), 0 7px 10px -5px rgba(' +
    hexToRgb(warningColor[0]) +
    ',.4)',
}
const dangerBoxShadow = {
  boxShadow:
    '0 4px 20px 0 rgba(' +
    hexToRgb(blackColor) +
    ',.14), 0 7px 10px -5px rgba(' +
    hexToRgb(dangerColor[0]) +
    ',.4)',
}
const roseBoxShadow = {
  boxShadow:
    '0 4px 20px 0 rgba(' +
    hexToRgb(blackColor) +
    ',.14), 0 7px 10px -5px rgba(' +
    hexToRgb(roseColor[0]) +
    ',.4)',
}

const warningCardHeader = {
  background:
    'linear-gradient(60deg, ' + warningColor[1] + ', ' + warningColor[2] + ')',
  ...warningBoxShadow,
}
const successCardHeader = {
  background:
    'linear-gradient(60deg, ' + successColor[1] + ', ' + successColor[2] + ')',
  ...successBoxShadow,
}
const dangerCardHeader = {
  background:
    'linear-gradient(60deg, ' + dangerColor[1] + ', ' + dangerColor[2] + ')',
  ...dangerBoxShadow,
}
const infoCardHeader = {
  background:
    'linear-gradient(60deg, ' + infoColor[1] + ', ' + infoColor[2] + ')',
  ...infoBoxShadow,
}
const primaryCardHeader = {
  background:
    'linear-gradient(60deg, ' + primaryColor[1] + ', ' + primaryColor[2] + ')',
  ...primaryBoxShadow,
}
const roseCardHeader = {
  background:
    'linear-gradient(60deg, ' + roseColor[1] + ', ' + roseColor[2] + ')',
  ...roseBoxShadow,
}

const card = {
  display: 'inline-block',
  position: 'relative',
  width: '100%',
  margin: '25px 0',
  boxShadow: '0 1px 4px 0 rgba(' + hexToRgb(blackColor) + ', 0.14)',
  borderRadius: '6px',
  color: 'rgba(' + hexToRgb(blackColor) + ', 0.87)',
  background: whiteColor,
}

const cardActions = {
  margin: '0 20px 10px',
  paddingTop: '10px',
  borderTop: '1px solid ' + grayColor[8],
  height: 'auto',
  ...defaultFont,
}

const cardHeader = {
  margin: '-20px 15px 0',
  borderRadius: '3px',
  padding: '15px',
}

const defaultBoxShadow = {
  border: '0',
  borderRadius: '3px',
  boxShadow:
    '0 10px 20px -12px rgba(' +
    hexToRgb(blackColor) +
    ', 0.42), 0 3px 20px 0px rgba(' +
    hexToRgb(blackColor) +
    ', 0.12), 0 8px 10px -5px rgba(' +
    hexToRgb(blackColor) +
    ', 0.2)',
  padding: '10px 0',
  transition: 'all 150ms ease 0s',
}

const tooltip = {
  padding: '10px 15px',
  minWidth: '130px',
  color: whiteColor,
  lineHeight: '1.7em',
  background: 'rgba(' + hexToRgb(grayColor[6]) + ',0.9)',
  border: 'none',
  borderRadius: '3px',
  opacity: '1!important',
  boxShadow:
    '0 8px 10px 1px rgba(' +
    hexToRgb(blackColor) +
    ', 0.14), 0 3px 14px 2px rgba(' +
    hexToRgb(blackColor) +
    ', 0.12), 0 5px 5px -3px rgba(' +
    hexToRgb(blackColor) +
    ', 0.2)',
  maxWidth: '200px',
  textAlign: 'center',
  fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
  fontSize: '12px',
  fontStyle: 'normal',
  fontWeight: '400',
  textShadow: 'none',
  textTransform: 'none',
  letterSpacing: 'normal',
  wordBreak: 'normal',
  wordSpacing: 'normal',
  wordWrap: 'normal',
  whiteSpace: 'normal',
  lineBreak: 'auto',
}

const title = {
  color: grayColor[2],
  textDecoration: 'none',
  fontWeight: '400',
  marginTop: '30px',
  marginBottom: '25px',
  minHeight: '32px',
  fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  '& small': {
    color: grayColor[1],
    fontSize: '65%',
    fontWeight: '400',
    lineHeight: '1',
  },
}

const cardTitle = {
  ...title,
  marginTop: '5px',
  marginBottom: '20px',
  minHeight: 'auto',
  fontSize: '20px',
  lineHeight: 1.3,
  paddingLeft:"1em",
    paddingRight:"1em",
  '& a': {
    ...title,
    marginTop: '.625rem',
    marginBottom: '0.75rem',
    minHeight: 'auto',
  },
}

const cardSubtitle = {
  marginTop: '-.375rem',
}

const cardLink = {
  '& + $cardLink': {
    marginLeft: '1.25rem',
  },
}

const main = {
  background: whiteColor,
  position: 'relative',
  zIndex: '3',
}

const mainRaised = {
  '@media (max-width: 576px)': {
    marginTop: '-30px',
  },
  '@media (max-width: 830px)': {
    marginLeft: '10px',
    marginRight: '10px',
  },
  margin: '-60px 30px 0px',
  borderRadius: '6px',
  boxShadow:
    '0 16px 24px 2px rgba(' +
    hexToRgb(blackColor) +
    ', 0.14), 0 6px 30px 5px rgba(' +
    hexToRgb(blackColor) +
    ', 0.12), 0 8px 10px -5px rgba(' +
    hexToRgb(blackColor) +
    ', 0.2)',
}

const section = {
  backgroundPosition: '50%',
  backgroundSize: 'cover',
}

const sectionDark = {
  backgroundColor: grayColor[3],
  background:
    'radial-gradient(ellipse at center,' +
    grayColor[4] +
    ' 0,' +
    grayColor[5] +
    ' 100%)',
}

const sectionDescription = {
  marginTop: '130px',
}

const description = {
  color: grayColor[0],
}

const mlAuto = {
  marginLeft: 'auto',
}

const mrAuto = {
  marginRight: 'auto',
}

const btnLink = {
  backgroundColor: 'transparent',
  boxShdow: 'none',
  marginTop: '5px',
  marginBottom: '5px',
}
const coloredShadow = {
  // some jss/css to make the cards look a bit better on Internet Explorer
  '@media all and (-ms-high-contrast: none), (-ms-high-contrast: active)': {
    display: 'none !important',
  },
  transform: 'scale(0.94)',
  top: '12px',
  filter: 'blur(12px)',
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundSize: 'cover',
  zIndex: '-1',
  transition: 'opacity .45s',
  opacity: '0',
}

export {
  hexToRgb,
  //variables
  drawerWidth,
  drawerMiniWidth,
  transition,
  container,
  containerFluid,
  boxShadow,
  card,
  defaultFont,
  primaryColor,
  secondaryColor,
  warningColor,
  dangerColor,
  successColor,
  infoColor,
  roseColor,
  grayColor,
  blackColor,
  whiteColor,
  twitterColor,
  facebookColor,
  googleColor,
  reactColor,
  linkedinColor,
  pinterestColor,
  youtubeColor,
  tumblrColor,
  behanceColor,
  dribbbleColor,
  redditColor,
  firebaseColor,
  instagramColor,
  primaryBoxShadow,
  infoBoxShadow,
  successBoxShadow,
  warningBoxShadow,
  dangerBoxShadow,
  roseBoxShadow,
  warningCardHeader,
  successCardHeader,
  dangerCardHeader,
  infoCardHeader,
  primaryCardHeader,
  roseCardHeader,
  cardActions,
  cardHeader,
  defaultBoxShadow,
  tooltip,
  title,
  cardTitle,
  cardSubtitle,
  cardLink,
  main,
  mainRaised,
  section,
  sectionDark,
  sectionDescription,
  description,
  mlAuto,
  mrAuto,
  btnLink,
  coloredShadow,
}
