import $ from 'jquery'
import React from 'react'
import HeaderView from './HeaderView.jsx'
import {Actions, UserStore} from '../models.jsx'

import { Col, Alert, Well, Glyphicon, Label, Input, Button } from 'react-bootstrap';

class UserCreateView extends React.Component {
    constructor() {
        super();
        this.state = {
            users: []
        };
        this.users = [];
        this.onCreateUser = this.onCreateUser.bind(this);
        this.performUserCreate = this.performUserCreate.bind(this);
    }
    onCreateUser(data) {
        this.users.push(data);
        this.setState({users: this.users})
    }
    performUserCreate(){
        var jid = $("#jid").val();
        var password = $("#password").val();
        Actions.createUser(jid, password);
    }
    componentDidMount() {
        this.unsubscribe = UserStore.listen(this.onCreateUser)
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    render() {
        return (
            <div>
                <HeaderView />
                <div className="container">
                <Col md={12}>
                    <h1>Create User</h1>
                    <p>
                        <strong>JID:</strong>
                        <input id="jid" type="text" />
                    </p>
                    <p>
                        <strong>password:</strong>
                        <input id="password" type="password" />
                    </p>
                    <p>
                        <Button onClick={this.performUserCreate}>Create</Button>
                    </p>
                    <p>
                        <strong>Users</strong>
                        <ul id="users">
                            {this.state.users.map(function(user){
                                return (
                                    <li key={user.id}>
                                        <strong>JID: {user.jid}</strong>
                                        <pre>{user.output}</pre>
                                    </li>
                                )
                            })}
                        </ul>
                    </p>
                </Col>
                </div>
            </div>
        )
    }
}


export default UserCreateView
