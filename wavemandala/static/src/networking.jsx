import io from "socket.io-client"

var SOCKETS = {};

function get_socket(name) {
    var socket = io.connect("http://" + document.domain + ":" + location.port, {"forceNew": true});
    socket.on("connect", function(){
        console.log("turning on " + name + " subscriber");
    });
    socket.on("disconnect", function(){
        window.location.reload();
    });
    SOCKETS[name] = socket;
    return socket
}

export default get_socket
