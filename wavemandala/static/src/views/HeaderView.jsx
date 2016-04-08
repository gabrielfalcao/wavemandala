import React from 'react'
import { Navbar, Nav, NavDropdown, NavItem, MenuItem, Col } from 'react-bootstrap';


class HeaderView extends React.Component {
    render() {
        var jid = window.wavemandala.jid;
        var self = this;
        return (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/">Wave Mandala</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavItem href="/#/chat">Chat</NavItem>
                        <NavItem href="/#/webmail">Webmail</NavItem>
                        <NavItem href="/#/manage-users">Manage Users</NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default HeaderView
