import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Navigations from './components/Navigations';

function App() {
  return (
    <>
      <Switch>
        <Route path = '/' component = {Navigations} />
      </Switch>
    </>
  )
}

export default App;
