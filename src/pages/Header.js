import React, { Component } from 'react';
import { Button, Container, FormControl, Navbar, Form, InputGroup, Modal } from 'react-bootstrap';
import logo from '../resources/Logo.svg';
import searchIcon from '../resources/Search.svg';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            showRegisterModal: false
        };
    }

    handleInputChange = (event) => {
        this.setState({ searchText: event.target.value });
    }

    handleShowRegisterModal = () => {
        this.setState({ showRegisterModal: true });
    }

    handleCloseRegisterModal = () => {
        this.setState({ showRegisterModal: false });
    }

    render() {
        return (
            <>
                <Navbar sticky="top" collapseOnSelect expand="md" className='custom-navbar' variant="dark">
                    <Container fluid>
                        <Navbar.Brand href="/">
                            <img
                                src={logo}
                                className="d-inline-block align-top"
                                alt="logo"
                            />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav" >
                            <Form className='d-flex flex-column flex-md-row align-items-center w-100'>
                                <InputGroup className="position-relative mb-2 mb-md-0">
                                    <InputGroup.Text style={{ backgroundColor: '#0D3040' }}>
                                        <img src={searchIcon} alt="Search" className="search-icon" style={{ backgroundColor: '#0D3040' }} />
                                    </InputGroup.Text>
                                    <FormControl
                                        type="text"
                                        placeholder="Найти курс или преподавателя"
                                        style={{
                                            maxWidth: '523px',
                                            height: '53px',
                                            color: 'white',
                                            border: '1px solid white',
                                            backgroundColor: '#0D3040',
                                        }}
                                        value={this.state.searchText}
                                        onChange={this.handleInputChange}
                                        className="placeholder-white"
                                    />
                                </InputGroup>
                                <div className="ms-md-auto">
                                    <Button variant="outline-info" className="mt-2 mt-md-0" style={{ height: '53px', maxWidth: '153px', minWidth: '153px', backgroundColor: '#50F1BE', borderColor: '#50F1BE', borderRadius: '15px', color: 'black', marginRight: '20px' }} onClick={this.handleShowRegisterModal}>
                                        Я преподаватель
                                    </Button>
                                </div>
                            </Form>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                
                <Modal show={this.state.showRegisterModal} onHide={this.handleCloseRegisterModal} size="md">
                    <Modal.Header closeButton>
                        <h5 style={{ color: 'black' }}>Войдите, чтобы редактировать курсы</h5>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="login">
                                <Form.Control type="text" placeholder="Логин" style={{ width: '304px', height: '50px' }} />
                            </Form.Group>
                            <Form.Group controlId="password">
                                <Form.Control type="password" placeholder="Пароль" style={{ width: '304px', height: '50px' }} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleCloseRegisterModal} style={{ backgroundColor: '#50F1BE', marginLeft: 'auto', marginRight: 'auto', display: 'block', width: '200px' }}>
                            Войти в аккаунт
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}
