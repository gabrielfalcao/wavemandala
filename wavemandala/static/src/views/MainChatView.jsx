import $ from 'jquery';
import React from 'react';

import HeaderView from './HeaderView.jsx';
import ChatView from './ChatView.jsx';
import { Col, Button, Well } from 'react-bootstrap';
import get_connection from '../networking.jsx';
import {loadCredentials, saveCredentials, clearCredentials} from '../models.jsx';

class MainChatView extends React.Component {
    constructor() {
        super();
        this.state = {credentials: loadCredentials()};
        this.onPerformLogin = this.onPerformLogin.bind(this);
        this.onPerformLogout = this.onPerformLogout.bind(this);
    }
    onPerformLogin(e) {
        var jid = $(this.refs.jidField).val();
        var password = $(this.refs.passwordField).val();
        this.setState({credentials: saveCredentials(jid, password)});
        return e.preventDefault();
    }
    onPerformLogout(e) {
        this.setState({credentials: clearCredentials()});
        return e.preventDefault();
    }
    render() {
        var jid = this.state.credentials.jid;
        var password = this.state.credentials.password;
        return (
            <div>
                <HeaderView />
                <div className="container">
                    {(jid && password) ? <div className="container">
                     <h1><a href="#" onClick={this.onPerformLogout}>(logout)</a></h1>
                     <ChatView jid={jid} password={password} />
                     </div>:
                     <Col md={12}>
                     <h2>please do the login</h2>
                     <form ref="loginForm" onSubmit={this.onPerformLogin}>
                         <Well>
                             <div className="form-group">
                                 <label htmlFor="jidField">JID</label>
                                 <input id="jidField" ref="jidField" type="text" />
                             </div>
                             <div className="form-group">
                                 <label htmlFor="passwordField">PASSWORD</label>
                                 <input id="passwordField" ref="passwordField" type="text" />
                             </div>
                             <div className="form-group">
                                 <Button onClick={this.onPerformLogin}>Login</Button>
                             </div>
                         </Well>
                     </form>
                     </Col>}
                </div>
            </div>
        )
    }
}


export default MainChatView
