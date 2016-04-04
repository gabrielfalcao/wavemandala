import "strophe.js"

var SOCKETS = {};

function get_connection(name) {
    ;
    var connection = new Strophe.Connection('https://wavemanda.la/http-bind');
    return connection;
}

export default get_connection
