import React from 'react'

import HeaderView from './HeaderView.jsx'
import MailInboxPanel from './MailInboxPanel.jsx'


class WebmailView extends React.Component {
    render() {
        var self = this;
        return (
            <div>
                <HeaderView />
                <div className="container">
                    <MailInboxPanel />
                </div>
            </div>
        )
    }
}


export default WebmailView
