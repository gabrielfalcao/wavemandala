import React from 'react'


class HeaderView extends React.Component {
    render() {
        var self = this;
        return (
            <div>
                <header className="navbar">
                    <section className="navbar-section">
                        <a href="#" className="btn btn-link btn-lg">
                            <i className="icon icon-people"></i>
                        </a>
                        <a href="#" className="navbar-brand">Wave Mandala</a>
                    </section>
                    <section className="navbar-section">
                        <a href="#" className="btn btn-link">Music</a>
                        <a href="#" className="btn btn-link">About</a>
                    </section>
                </header>
            </div>
        )
    }
}

export default HeaderView
