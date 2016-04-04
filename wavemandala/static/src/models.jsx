import Reflux from 'reflux'
var $ = require('jquery');

const Actions = Reflux.createActions([
    "getTrack",
    "listTracks"
]);


const TrackListStore = Reflux.createStore({
    init: function() {
        this.listenTo(Actions.listTracks, this.retrieveTrackList);
    },
    retrieveTrackList: function(index) {
        var store = this;
        var attempt = (typeof index === 'number') ? index : 0;

        // abort after 10
        if (attempt >= 10) {
            /*console.log("attempted to retrieve track list 10 times until giving up");*/
            store.trigger();
            return;
        }

        $.get('/api/track-list').done(function(data, status_text, response){
            console.log("track-list", data);
            if (data.length > 0) {
                if (typeof data[0].id === 'undefined') {
                    /*console.log("invalid tracks", data);*/
                    return;
                }
                store.trigger(data);
            } else {
                store.retrieveTrackList(attempt + 1)
            }
        });
    }
});

const TrackStore = Reflux.createStore({
    init: function() {
        this.listenTo(Actions.getTrack, this.retrieveTrackById);

    },
    retrieveTrackById: function(id, index) {
        var self = this;
        var path = '/api/track/' + id;

        // abort after 5 attempts
        if (attempt >= 5) {
            /*console.log("attempted to retrieve track (" + id + ") 5 times until giving up");*/
            self.trigger(null);
            return;
        }

        $.get(path).done(function(data, status_text, response){
            /*console.log("track", data);*/
            if (data !== null) {
                self.trigger(data);
            } else {
                self.retrieveTrackById(id, attempt + 1);
            }
        });
    }
});


export default {Actions, TrackListStore, TrackStore, StrategyStore}
