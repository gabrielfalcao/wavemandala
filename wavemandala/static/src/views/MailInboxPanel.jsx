import React from 'react'
import {Actions, MessageListStore} from '../models.jsx'
import socket from '../networking.jsx'
import history from '../core.jsx'
import LoadingView from './LoadingView.jsx'


class MailInboxPanel extends React.Component {
    constructor() {
        super();
        this.state = {
	    messages: []
        };
        this.onRetrieveMessages = this.onRetrieveMessages.bind(this);
    }
    onRetrieveMessages(messages) {
        if (messages && messages.length > 0) {
            this.setState({
                "messages": messages
            });
        } else {
            window.location.reload();
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
        return (
            this.state.messages.length > 0 ? <div className="col-md-12">
                <h3>attackers available: {this.state.messages.length}</h3>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Subject</th>
                            <th>From</th>
                            <th>To</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.messages.map(function(message) {
                            return <tr key={message.id}>
                            <td><a href={`#/webmail/msg/${message.id}`}>{message.id}</a></td>
                            <td>{message.subject}</td>
                            <td>{message.from}</td>
                            <td>{message.to}</td>
                            </tr>
                         })}
                    </tbody>
                </table>
            </div> : <LoadingView>loading messages</LoadingView>
        )
    }
}

export default MailInboxPanel
