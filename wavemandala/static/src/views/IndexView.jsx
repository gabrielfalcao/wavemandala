import React from 'react'
import Wavesurfer from 'react-wavesurfer';
import $ from 'jquery';

import HeaderView from './HeaderView.jsx'
import TrackView from './TrackView.jsx'



class IndexView extends React.Component {
    propTypes: {
        tracks: React.PropTypes.array,
    }
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        const {store} = this.context;
        $.getJSON("/api/tracks", function(tracks) {
            this.setState({tracks:tracks});

            store.dispatch({
                type: "LIST_TRACKS",
                tracks: tracks
            });
        }.bind(this));
    }
    render() {
        const {tracks} = this.state;
        return (
            <div className="container grid-960">
                <div className="columns">
                    <div className="column col-12">
                        <HeaderView />
                        {tracks ? tracks.map(function(track) {
                            return <TrackView key={track.id} track={track} />;
                         }) : null}
                    </div>
                </div>
            </div>
        )
    }
}

IndexView.contextTypes = {
    store: React.PropTypes.object
};



export default IndexView
