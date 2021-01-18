import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Pricelist from './Pricelist'

export default function Router() {
    return (
        <>
            <Switch>
                <Route exact path = '/pricelist' component = {Pricelist}/>
            </Switch>
        </>
    )
}