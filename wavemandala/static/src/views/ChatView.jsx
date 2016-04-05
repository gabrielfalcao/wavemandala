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
        this.printLog = this.printLog.bind(this);
        this.onConnect = this.onConnect.bind(this);
        this.onReceiveMessage = this.onReceiveMessage.bind(this);
        this.onReceiveRoster = this.onReceiveRoster.bind(this);
        this.connection = get_connection();
        this.connection.rawInput = function(data){
            //console.log("INPUT", data)
        };
        this.connection.rawOutput = function(data){
            //console.log("OUTPUT", data)
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
            this.connection.addHandler(this.onReceiveMessage, null, 'message', null, null,  null);
            this.connection.addHandler(this.onReceiveRoster, null, 'roster', null, null,  null);
	    this.connection.send($pres().tree());
        }
    }
    onReceiveRoster(msg) {
        console.log("ROSTER", msg);
    }
    onReceiveMessage(msg) {
        var to = msg.getAttribute('to');
        var from = msg.getAttribute('from');
        var type = msg.getAttribute('type');
        var elems = msg.getElementsByTagName('body');

        if (type == "chat" && elems.length > 0) {
	    var body = elems[0];

	    this.printLog([
                ['FROM: ' + from],
                ['TYPE: ' + type],
                ['TO: ' + to],
                ['MESSAGE: ' + Strophe.getText(body)],
            ].join('\n'));
	    //var reply = $msg({to: from, from: to, type: 'chat'}).cnode(Strophe.copyElement(body));
	    //this.connection.send(reply.tree());
	    //this.printLog('ECHOBOT: I sent ' + from + ': ' + Strophe.getText(body));
        }
	this.connection.send($pres().tree());

        // we must return true to keep the handler alive.
        // returning false would remove it after it finishes.
        return true;
    }
    printLog(msg) {
        $("#local-logs").append(msg);
        $("#local-logs").append("\n");
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
        var jid = this.props.jid;
        return (
            <div className="container">
                <Col md={12}>
                <h3>
                    <strong>ECHOBOT: <code>{jid}</code><span>({this.state.connectionStatus})</span></strong>
                </h3>
                <p>
                    Add the user test@wavemanda.la in your XMPP roster and send messages
                </p>

                <pre id="local-logs"></pre>
                </Col>
            </div>
        )
    }
}


export default ChatView
