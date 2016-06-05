import  '../styles/app.less'

import React from 'react'
import { render } from 'react-dom'

// First we import some components...
import { Router, Route, Redirect, IndexRoute } from 'react-router'

import HeaderView from './views/HeaderView.jsx'
import IndexView from './views/IndexView.jsx'
import history from './core.jsx'

import $ from 'jquery'

$(function(){
    render((
        <Router history={history}>
            <Route path="/" component={IndexView} />
        </Router>
    ), document.getElementById('app-container'))
})
