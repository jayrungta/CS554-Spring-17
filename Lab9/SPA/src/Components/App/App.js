import React from 'react';
import {
  BrowserRouter as Router,
  Route} from 'react-router-dom'

import { Users } from '../Users/Users';
import logo from './logo.svg';
import './App.css';

const App = () => (
  <Router>
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>User Lookup App</h2>
      </div>
      <div className="App-body">
        <Route exact path="/" component={Users} />
      </div>
    </div>
  </Router>
)

export default App
