import Reflux from 'reflux'
var $ = require('jquery');

const Actions = Reflux.createActions([
    "listMessages",
    "createUser",
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
                store.trigger([]);
            }
        });
    }
});


const UserStore = Reflux.createStore({
    init: function() {
        this.listenTo(Actions.createUser, this.createUser);
    },
    createUser: function(jid, password) {
        var store = this;

        $.ajax({
            url: '/api/user',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                jid: jid,
                password: password
            }),
            success: function(data){
                store.trigger(data);
                console.log(arguments);
            }
        });
    }
});

export default {Actions, UserStore, MessageListStore}
