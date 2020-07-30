import React, { Suspense } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

/* import Task from 'pages/Task' */
import Tasks from 'pages/Tasks'

import GlobalStyle from 'globalStyle'
import theme from 'theme'

const App = () => (
  <Router>
    <ThemeProvider theme={theme}>
      <Suspense
        fallback={
          <div
            style={{
              textAlign: 'center',
              fontSize: '24px',
              fontWeight: '700',
              margin: '100px',
            }}
          >
            Loading...
          </div>
        }
      >
        <Route exact path='/tasks' component={Tasks} />
        {/* <Route exact path='/task' component={Task} /> */}
        <Redirect from='/' to='/applicants' exact />
        <GlobalStyle />
      </Suspense>
    </ThemeProvider>
  </Router>
)

export default App
