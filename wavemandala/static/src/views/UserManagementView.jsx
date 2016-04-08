import $ from 'jquery'
import React from 'react'
import HeaderView from './HeaderView.jsx'
import {Actions, UserStore} from '../models.jsx'

import { Col, Alert, Well, Glyphicon, Label, Input, Button } from 'react-bootstrap';

class UserManagementView extends React.Component {
    constructor() {
        super();
        this.state = {
            users: []
        };
        this.onCreateUser = this.onCreateUser.bind(this);
        this.performUserCreate = this.performUserCreate.bind(this);
        this.onDeleteUser = this.onDeleteUser.bind(this);
        this.performUserDelete = this.performUserDelete.bind(this);
    }
    onCreateUser(data) {
        this.setState({users: data})
    }
    performUserCreate(){
        var jid = $("#jid").val();
        var password = $("#password").val();
        Actions.createUser(jid, password);
    }
    onDeleteUser(data) {
        this.setState({users: data});
    }
    performUserDelete(){
        var jid = $("#jid").val();
        Actions.deleteUser(jid);
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
                    <h1>Create/Delete User</h1>
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
                        <Button onClick={this.performUserDelete}>Delete</Button>
                    </p>
                    <p>
                        <strong>Users</strong>
                        {this.state.users.map(function(user){
                            return <Well key={user.jid}>
                                 <pre>
                                     <strong>JID:</strong>
                                     <code>{user.jid}</code>
                                     <br />
                                     <strong>PASSWORD:</strong>
                                     <code>{user.password}</code>
                                 </pre>
                             </Well>
                         })}
                    </p>
                </Col>
                </div>
            </div>
        )
    }
}


export default UserManagementView
