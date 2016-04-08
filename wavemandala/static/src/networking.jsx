import "webrtc-adapter"
import "strophe.js"
import "strophejs-plugins/roster/strophe.roster.js"
import "strophejs-plugins/muc/strophe.muc.js"
import "strophejs-plugins/archive/strophe.archive.js"

var SOCKETS = {};

function get_connection(name) {
    ;
    var connection = new Strophe.Connection('https://wavemanda.la:5281/http-bind');
    return connection;
}

export default get_connection
