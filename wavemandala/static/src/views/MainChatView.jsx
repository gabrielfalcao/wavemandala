import React from 'react'

import HeaderView from './HeaderView.jsx'
import ChatView from './ChatView.jsx'
import { Col } from 'react-bootstrap';
import get_connection from '../networking.jsx'

class MainChatView extends React.Component {
    constructor() {
        super();
        this.state = {
            credentials: {
                jid: "test@wavemanda.la",
                password: "test",
            }
        };
    }
    render() {
        var jid = this.state.credentials.jid;
        var password = this.state.credentials.password;
        return (
            <div>
                <HeaderView />
                <div className="container">
                    <ChatView jid={jid} password={password} />
                </div>
            </div>
        )
    }
}


export default MainChatView
