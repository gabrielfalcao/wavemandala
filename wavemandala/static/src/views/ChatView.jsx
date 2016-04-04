import $ from 'jquery'
import React from 'react'

import { Col, Alert, Well, Glyphicon, Label, Input, Button } from 'react-bootstrap';
import get_connection from '../networking.jsx'

class ChatView extends React.Component {
    constructor() {
        super();
        this.state = {
            connected: false,
            connectionStatus: "disconnected"
        };
        this.onConnect = this.onConnect.bind(this);
        this.connection = get_connection();
        this.connection.rawInput = function(data){
            $("#input-logs").append(data);
            $("#input-logs").append("\n");
        };
        this.connection.rawOutput = function(data){
            $("#output-logs").append(data);
            $("#output-logs").append("\n");
        };
    }
    onConnect(status) {
        if (status == Strophe.Status.CONNECTING) {
	    this.setState({
                connectionStatus: "connecting"
            });
        } else if (status == Strophe.Status.CONNFAIL) {
	    this.setState({
                connectionStatus: "connection failed"
            });
        } else if (status == Strophe.Status.DISCONNECTING) {
	    this.setState({
                connectionStatus: "disconnecting"
            });
        } else if (status == Strophe.Status.DISCONNECTED) {
	    this.setState({
                connected: false,
                connectionStatus: "disconnected"
            });
        } else if (status == Strophe.Status.CONNECTED) {
	    this.setState({
                connected: true,
                connectionStatus: "connected"
            });
        }
    }
    componentDidMount() {
        var jid = this.props.jid;
        var password = this.props.password;
        this.connection.connect(jid, password, this.onConnect)
    }
    componentWillUnmount() {
        this.connection.disconnect()
    }
    render() {
        var self = this;
        return (
            <div className="container">
                <h2>XMPP</h2>
                <hr />
              <Col md={6}>
                <h4>input</h4>
                <pre id="input-logs"></pre>
              </Col>
              <Col md={6}>
                <h4>output</h4>
                <pre id="output-logs"></pre>
              </Col>
            </div>
        )
    }
}


export default ChatView
