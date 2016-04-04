import Reflux from 'reflux'
var $ = require('jquery');

const Actions = Reflux.createActions([
    "listMessages"
]);


const MessageListStore = Reflux.createStore({
    init: function() {
        this.listenTo(Actions.listMessages, this.retrieveInbox);
    },
    retrieveInbox: function(name) {
        var store = this;

        $.get('/api/mail/inbox/' + name).done(function(data, status_text, response){
            console.log("inbox of " + name, data);
            if (data.inbox && data.inbox.length > 0) {
                store.trigger(data.inbox);
            } else {
                console.log("Failed " + response);
            }
        });
    }
});

export default {Actions, MessageListStore}
