import React, {Component} from 'react';
import {Container, Navbar} from 'react-bootstrap';
import logo from '../resources/Logo.svg';

export default class Footer extends Component {
    render() {
        return (
            <Navbar fixed="bottom" collapseOnSelect expand="md" className='custom-navbar' variant="dark">
                <Container fluid>
                    <Navbar.Brand href="/">
                        <img
                            src={logo}
                            className="d-inline-block align-top"
                            alt="logo"
                        />
                    </Navbar.Brand>
                </Container>
            </Navbar>
        );
    }
}
