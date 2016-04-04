import React from 'react'
import { Navbar, Nav, NavDropdown, NavItem, MenuItem, Col } from 'react-bootstrap';
var LoaderIMG = require("./loader.gif");



class LoadingView extends React.Component {
    render() {
        var self = this;
        var headerStyle = {
            color: '#5cbbff',
            paddingBottom: "2px",
        };
        return (
            <div className="col-md-12">
                <center>
                    <h1 style={headerStyle}>
                        <img src={LoaderIMG} />
                        {this.props.children}
                    </h1>
                </center>
            </div>
        )
    }
}

export default LoadingView
