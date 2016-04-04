import React from 'react'

import history from '../core.jsx'
import HeaderView from './HeaderView.jsx'
import MailInboxPanel from './MailInboxPanel.jsx'
import LoadingView from './LoadingView.jsx'

import _ from 'underscore'
import { Col, Alert, Well, Glyphicon, Label, Input, Button } from 'react-bootstrap';

import {Actions, MessageListStore} from '../models.jsx'
import socket from '../networking.jsx'
import $ from 'jquery'


class MailMessageView extends React.Component {
    constructor() {
        super();
        this.state = {
            "done": false,
            "message": null
        };
        this.onRetrieveMessages = this.onRetrieveMessages.bind(this);
    }
    onRetrieveMessages(messages) {
        var self = this;
        var message_id = this.props.params.id;

        if (messages && messages.length > 0) {
            _.each(messages, function(message) {
                if (message.id === message_id) {
                    self.setState({"message": message, "done": true});
                }
            });
        } else {
            history.push('/');
            return;
        }
    }
    componentDidMount() {
        Actions.listMessages('webmaster');
        this.unsubscribe = MessageListStore.listen(this.onRetrieveMessages);
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    render() {
        var self = this;
        var message = this.state.message;
        return (
            <div>
                <HeaderView />
                {message ? <div className="container">
                 <h3>id:{message.id}</h3>
                 <h4>to: {message.to}</h4>
                 <h4>from: {message.from}</h4>
                 {message.messages.map(function(msg) {
                     return msg.id ? ( <Col md={12} key={msg.id}>
                     <h4>content-type: {JSON.stringify(msg.content_type)}</h4>
                         <pre>{msg.body}</pre>

                     {msg.parts.map(function(part) {
                         return part.id ? ( <Col md={12} key={part.id}>
                         <h4>content-type: {JSON.stringify(part.content_type)}</h4>
                         <pre>{part.body}</pre>
                         </Col>) : null
                     })}

                     </Col>) : null
                 })}
                </div> : <LoadingView>loading {self.props.params.id}...</LoadingView>}
            </div>
        )
    }
}


export default MailMessageView
