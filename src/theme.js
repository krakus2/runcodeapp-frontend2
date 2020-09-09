const theme = {
  primaryColor: '#009688',
  primaryColorDarker: '#00786c',
  secondaryColor: '#039be5',
  errorColor: '#f50057',
  defaultSpacing: '8px',
  defaultFontSize: '16px',
  backgroundColor: '#f7f7f8',
  highBlack: 'rgba(0, 0, 0, 0.87)',
  highLowerBlack: 'rgba(0, 0, 0, 0.7)',
  mediumBlack: 'rgba(0, 0, 0, 0.6)',
  mediumLowerBlack: 'rgba(0, 0, 0, 0.5)',
  lowBlack: 'rgba(0, 0, 0, 0.3)',
  lowestBlack: 'rgba(0, 0, 0, 0.12)',
}

export const sizes = {
  mobile: 320,
  desktop: 1000,
}

export const device = {
  mobile: `(max-width: ${sizes.desktop - 1}px)`,
  desktop: `(min-width: ${sizes.desktop}px)`,
}

export default theme
