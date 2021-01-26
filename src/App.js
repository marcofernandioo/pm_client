import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Navigations from './components/Navigations';

function App() {
  return (
    <>
      <h1>Pasar Medan</h1>
      {/* <Input /> */}
      {/* <Navigations /> */}
      <Switch>
        <Route path = '/' component = {Navigations} />
      </Switch>
    </>
  )
}

export default App;
