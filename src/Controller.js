import React, { Component } from 'react'

//Router import for redirection.
import { Route, Switch } from "react-router-dom";

//Imports of different pages in the application
import Home from './screens/home/Home';
import Details from './screens/details/Details.js';
import Profile from '../src/common/profile/Profile.js';
import Checkout from '../src/screens/checkout/Checkout.js';

class Controller extends Component {
    constructor() {
        super();
        this.baseUrl = 'http://localhost:8080/api/'
    }
    render() {
        return (
            <Switch>
                <Route exact path='/' render={(props) => <Home {...props} baseUrl={this.baseUrl}/>} />
                <Route exact path='/restaurant/:id' render={(props) => <Details {...props} baseUrl={this.baseUrl}/>} />
                <Route exact path="/profile" render={() => <Profile />}></Route>
                {/* Routing to the checkout page */}
                {/* <Route path='/checkout' render={(props) => (
                        sessionStorage.getItem('customer-cart') === null ? (
                            Redirect to='/'
                        ) : (
                            <Checkout {...props} baseUrl={this.baseUrl} />
                        )
                    )} /> */}
                <Route exact path="/checkout" render={props=> <Checkout {...props} baseUrl={this.baseUrl}/>} />
            </Switch>
        )
    }
}

export default Controller;

