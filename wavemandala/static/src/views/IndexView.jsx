import React from 'react'

import HeaderView from './HeaderView.jsx'

class IndexView extends React.Component {
    constructor() {
        super();
        this.state = {
        };
    }
    render() {
        return (
            <div>
                <HeaderView />
                <div className="container">
                    <h1>Danger! Experimentation Zone</h1>
                    <h3>Try the navbar!</h3>
                </div>
            </div>
        )
    }
}


export default IndexView
