import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { login } from './utils/auth'

// authenticate and redirect before starting React
login()

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
