import React, {Component, PropTypes} from 'react';
import { HashRouter, Route } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import App from './app';
import test from './components/test';

const customHistory = createBrowserHistory();

export default class Routes extends Component{
    render(){
        return (
            <HashRouter>
                <Route path="/" component={App}></Route>
            </HashRouter>
        );
    }
}
