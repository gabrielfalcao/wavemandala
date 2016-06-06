import  '../styles/app.less'

import React from 'react'
import { render } from 'react-dom'

// First we import some components...
import { Router, Route, Redirect, IndexRoute } from 'react-router'
import {wavemandalaApp} from './reducers.jsx'
import HeaderView from './views/HeaderView.jsx'
import IndexView from './views/IndexView.jsx'
import history from './core.jsx'
import {Provider} from 'react-redux'
import {createStore, compose} from 'redux'
import {loadState, saveState, clearState} from './models.jsx'

import $ from 'jquery'

$(function(){
    let store = createStore(wavemandalaApp, loadState(), compose(
        window.devToolsExtension ? window.devToolsExtension() : f => f
    ));
    render((
        <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={IndexView} />
        </Router>
        </Provider>
    ), document.getElementById('app-container'))
})
