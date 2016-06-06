import React from 'react'
import Wavesurfer from 'react-wavesurfer';
import {Icon} from 'react-fa'
import {request} from 'browser-request';


class TrackView extends React.Component {
    propTypes: {
        track: React.PropTypes.object,
    }
    constructor() {
        super();
        this.state = {
            playing: false,
            pos: 0,
            volume: 1.0
        };
        this.handleTogglePlay = this.handleTogglePlay.bind(this);
        this.handlePosChange = this.handlePosChange.bind(this);
        this.handleFinish = this.handleFinish.bind(this);
        this.handleReady = this.handleReady.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);

    }
    handleFinish(e) {
        this.setState({
            pos: 0,
            playing: false
        });
    }
    handlePosChange(e) {
        this.setState({
            pos: e.originalArgs ? e.originalArgs[0] : +e.target.value
        });
    }
    handleVolumeChange(e) {
        this.setState({
            volume: +e.target.value
        });
    }

    handleReady() {
        this.setState({
            pos: 0
        });
    }
    handleTogglePlay() {
        this.setState({
            playing: !this.state.playing
        });
    }
    render() {
        const waveOptions = {
            fillParent: true,
            scrollParent: false,
            height: 100,
            progressColor: '#E7B88C',
            waveColor: '#E7B88C',
            cursorColor: '#57A2A8',
            cursorWidth: 2,
            barWidth: 1,
        };
        const {track} = this.props;
        return (
            <div className="player">
                <h3>{track.title}</h3>
                <Wavesurfer
                              volume={this.state.volume}
                              pos={this.state.pos}
                              options={waveOptions}
                              onFinish={this.handleFinish}
                              onPosChange={this.handlePosChange}
                              audioFile={track.url}
                              playing={this.state.playing}
                              onReady={this.handleReady}
                />
                <div className="btn-group btn-group-block">
                    <button onClick={this.handleTogglePlay} className="btn btn-lg btn-link">
                        <Icon name={this.state.playing ? "pause": "play"} size="2x" />
                    </button>
                    <button onClick={this.handleDownload} className="btn btn-lg btn-link">
                        <Icon name={"cloud-download"} size="2x" />
                    </button>
                </div>
            </div>
        )
    }
}

TrackView.contextTypes = {
    store: React.PropTypes.object
};


export default TrackView
