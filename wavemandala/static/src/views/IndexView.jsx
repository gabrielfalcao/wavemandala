import React from 'react'
import Wavesurfer from 'react-wavesurfer';

import HeaderView from './HeaderView.jsx'
import TrackView from './TrackView.jsx'



class IndexView extends React.Component {
    constructor() {
        super();
        this.state = {
            audioFile: '/dist/mixing-colors1.0.wav',
        };
    }
    render() {
        return (
            <div className="container grid-960">
                <div className="columns">
                    <div className="column col-12">
                        <HeaderView />

                        <TrackView source={this.state.audioFile} />
                    </div>
                </div>
            </div>
        )
    }
}


export default IndexView
