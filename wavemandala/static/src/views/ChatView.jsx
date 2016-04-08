import $ from 'jquery'
import React from 'react'

import { Col, Alert, Well, Glyphicon, Label, Input, Button } from 'react-bootstrap';
import get_connection from '../networking.jsx'

class ChatView extends React.Component {
    constructor() {
        super();
        this.state = {
            connected: false,
            connectionStatus: "disconnected",
            remoteJid: null,
            hasBuddy: false
        };
        this.webrtc = null;
        this.p2pConnections = {};
        this.printLog = this.printLog.bind(this);
        this.onConnect = this.onConnect.bind(this);
        this.ensurePeerConnection = this.ensurePeerConnection.bind(this);
        this.connectToFriend = this.connectToFriend.bind(this);
        this.initiateLocalStream = this.initiateLocalStream.bind(this);
        this.onReceiveMessage = this.onReceiveMessage.bind(this);
        this.onGetUserMediaSucceeded = this.onGetUserMediaSucceeded.bind(this);
        this.onGetUserMediaError = this.onGetUserMediaError.bind(this);
        this.onGetIceCandidate = this.onGetIceCandidate.bind(this);
        this.onGotStream = this.onGotStream.bind(this);
        this.createWEBRTCConnection = this.createWEBRTCConnection.bind(this);
        this.syncMetadata = this.syncMetadata.bind(this);
        this.descriptionHandler = this.descriptionHandler.bind(this);
        this.createAnswerError = this.createAnswerError.bind(this);
        this.createOfferError = this.createOfferError.bind(this);

        this.xmpp = get_connection();
        this.xmpp.rawInput = function(data) {
            this.printLog("INPUT:" + data);
        }.bind(this);
        this.xmpp.rawOutput = function(data) {
            this.printLog("OUTPUT:" + data);
        }.bind(this);
        this.ICE_SERVERS = {
            'iceServers': [
                {
                    'url': 'stun:stun.services.mozilla.com'
                },
                {
                    'url': 'stun:stun.l.google.com:19302'
                }
            ]
        };
    }
    ensurePeerConnection(instructions){
        if (this.webrtc == null) {
            this.createWEBRTCConnection(instructions);
        }
    }
    connectToFriend() {
        var remoteJid = $(this.refs.remoteJidField).val();
        this.setState({
            remoteJid: remoteJid,
            hasBuddy: true
        });
        this.ensurePeerConnection({asCaller: true});
    }
    syncMetadata(data) {
        var message = JSON.stringify(data);
        var info = {
            to: this.state.remoteJid,
            from: this.props.jid,
            type: 'chat'
        };
        console.log("syncMetadata", info);
	var meta = $msg(info).cnode(Strophe.xmlElement('body', message));
	this.xmpp.send(meta.tree());
    }
    descriptionHandler(description) {
        console.log('got description', description);
        this.webrtc.setLocalDescription(description, function () {
            this.syncMetadata({'sdp': description});
        }.bind(this));
    }
    createOfferError(error) {
        console.log("offer error:", error);
    }
    createAnswerError(error) {
        console.log("offer error:", error);
    }
    createWEBRTCConnection(instructions) {
        this.webrtc = new RTCPeerConnection(this.ICE_SERVERS);
        this.webrtc.onicecandidate = this.onGetIceCandidate;
        this.webrtc.onaddstream = this.onGotStream;
        var isCaller = instructions.asCaller || (! instructions.asReceiver);
        if (isCaller) {
            this.webrtc.createOffer(
                this.descriptionHandler,
                this.createOfferError
            );
        }
        this.initiateLocalStream();
    }
    onGotStream(event){
        console.log("Got stream", event);
        this.refs.remoteVideo.src = window.URL.createObjectURL(event.stream);
    }
    onGetIceCandidate(event){
        if(event.candidate != null) {
            this.syncMetadata({'ice': event.candidate});
        }
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
            this.xmpp.addHandler(this.onReceiveMessage, null, 'message', null, null,  null);
            this.xmpp.send($pres.tree());
        }
    }
    initiateLocalStream(){
        var constraints = {
            // chrome
            video: true,
            audio: true,
            // firefox
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true
        };
        navigator.getUserMedia(constraints, this.onGetUserMediaSucceeded, this.onGetUserMediaError);
    }
    onReceiveMessage(msg) {
        console.log("GOT MESSAGE", msg);
//        this.setState({hasBuddy: true});
//        var body = msg.getElementsByTagName('body');
//        var rawMessage = Strophe.getText(body);
//
//        this.ensurePeerConnection({asReceiver: true});
//        try {
//            var signal = JSON.parse(rawMessage);
//        } catch (e){
//            console.log(e);
//            return;
//        }
//        if(signal.sdp) {
//            this.webrtc.setRemoteDescription(new RTCSessionDescription(signal.sdp), function() {
//                this.webrtc.createAnswer(this.descriptionHandler, this.createAnswerError);
//            }.bind(this));
//        } else if(signal.ice) {
//            this.webrtc.addIceCandidate(new RTCIceCandidate(signal.ice));
//        }
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
        this.xmpp.connect(jid, password, this.onConnect);
    }
    onGetUserMediaSucceeded(stream){
        this.refs.localVideo.src = window.URL.createObjectURL(stream);
        this.webrtc.addStream(stream);
    }
    onGetUserMediaError(error){
        this.printLog("ERROR: " + error + "\n");
    }
    componentWillUnmount() {
        this.xmpp.disconnect()
    }
    render() {
        var jid = this.props.jid;
        return (
            <Col md={12}>
                <h3>
                    <strong>
                        user: <code>{jid}</code>&nbsp;-&nbsp;
                        <span>({this.state.connectionStatus})</span>
                    </strong>
                </h3>
                {!this.state.hasBuddy ? <div className="container">
                 <Col md={12}><h2>set the remote JID</h2>
                 <h4>JID:</h4>
                 <input type="text" ref="remoteJidField" />
                 <Button onClick={this.connectToFriend}>CONNECT</Button>
                 </Col>
                 </div>: null}
                <div className="container">
                    <Col md={6}><video ref="remoteVideo" autoPlay style={{width:"100%"}}></video></Col>
                    <Col md={6}><video ref="localVideo" autoPlay muted style={{width:"100%"}}></video></Col>
                    <Col md={12}><br /><hr /><br /></Col>
                    <Col md={12}><pre id="local-logs"></pre></Col>
                </div>
            </Col>
        )
    }
}


export default ChatView
