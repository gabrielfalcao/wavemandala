import Reflux from 'reflux'
var $ = require('jquery');

const Actions = Reflux.createActions([
    "listMessages",
    "createUser",
    "deleteUser",
    "listUsers",
]);


function saveCredentials(jid, password){
    var credentials = {
        jid: jid,
        password: password,
    };
    localStorage.setItem("wavemandala.credentials", JSON.stringify(credentials));
    return credentials;
}

function clearCredentials(){
    localStorage.clear();
    return {
        jid: null,
        password: null
    };
}

function loadCredentials(){
    var raw = localStorage.getItem("wavemandala.credentials");
    if (typeof raw !== 'string') {
        return {
            jid: null,
            password: null
        }
    }
    try {
        return JSON.parse(raw);
    } catch (e) {
        return {
            jid: null,
            password: null
        }
    }
}

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

const UserListStore = Reflux.createStore({
    init: function() {
        this.listenTo(Actions.listUsers, this.retrieveUsers);
    },
    retrieveUsers: function(name) {
        var store = this;

        $.get('/api/users').done(function(data, status_text, response){
            store.trigger(data);
        });
    }
});


const UserStore = Reflux.createStore({
    init: function() {
        this.listenTo(Actions.createUser, this.createUser);
        this.listenTo(Actions.deleteUser, this.deleteUser);
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
    },
    deleteUser: function(jid) {
        var store = this;

        $.ajax({
            url: '/api/user',
            method: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify({
                jid: jid
            }),
            success: function(data){
                store.trigger(data);
                console.log(arguments);
            }
        });
    }
});

export default {Actions, UserStore, MessageListStore, saveCredentials, loadCredentials, clearCredentials, UserListStore}
