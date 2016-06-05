import React from 'react'
import Wavesurfer from 'react-wavesurfer';
import {Icon} from 'react-fa'

class TrackView extends React.Component {
    constructor() {
        super();
        this.state = {
            playing: false,
            pos: 0,
            volume: 1.0
        };
        this.handleTogglePlay = this.handleTogglePlay.bind(this);
        this.handlePosChange = this.handlePosChange.bind(this);
        this.handleReady = this.handleReady.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);

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

        return (
            <div className="player">
                <Wavesurfer
                              volume={this.state.volume}
                              pos={this.state.pos}
                              options={waveOptions}
                              onPosChange={this.handlePosChange}
                              audioFile={this.props.source}
                              playing={this.state.playing}
                              onReady={this.handleReady}
                />
                <button onClick={this.handleTogglePlay} className="btn btn-primary">
                    <Icon spin name="volume-off" />
                </button>
            </div>
        )
    }
}


export default TrackView
