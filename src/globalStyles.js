import { createGlobalStyle } from 'styled-components'

import theme from './theme'

const GlobalStyle = createGlobalStyle`
   html, body {
      font-family: Roboto;
      font-size: ${theme.defaultFontSize};
      margin: 0;
      padding: 0;
      box-sizing: border-box;
   }
   ::selection {
      background: ${theme.primaryColor};
      color: white;
   }
   h3{
      font-size: 1.3rem;
      font-weight: 500;
      margin: 5px 0;
   }
   p{
      font-size: 0.875rem;
      font-weight: 400;
      margin: 0;
      color: ${theme.highLowerBlack};
   }
   textarea, input, button, select { font-family: inherit; font-size: inherit; }
`

export default GlobalStyle
