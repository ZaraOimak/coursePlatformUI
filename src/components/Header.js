import React, {Component} from 'react';
import {Button, Container, Form, FormControl, InputGroup, Modal, Navbar} from 'react-bootstrap';
import logo from '../resources/Logo.svg';
import searchIcon from '../resources/Search.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomButton from './CustomButton';
import axios from 'axios';

const fetchLogin = (uuid) => {
    return axios.get(`http://localhost:8080/authors/${uuid}`)
        .then(response => {
            if (response.data) {
                return {isValid: true, author: response.data};
            } else {
                return {isValid: false, error: "No such author exists."};
            }
        })
        .catch(error => {
            console.error('Login failed:', error);
            return {isValid: false, error: error.response ? error.response.data : "Unknown error"};
        });
};

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            showRegisterModal: false,
            uuid: '',
            isLoggedIn: localStorage.getItem('authorUUID') ? true : false,
        };
    }

    handleInputChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    handleShowRegisterModal = () => {
        this.setState({showRegisterModal: true});
    }

    handleCloseRegisterModal = () => {
        this.setState({showRegisterModal: false, uuid: ''});
    }

    handleLogin = (event) => {
        event.preventDefault();
        const {uuid} = this.state;

        fetchLogin(uuid).then(data => {
            if (data.isValid) {
                localStorage.setItem('authorUUID', uuid);
                this.setState({isLoggedIn: true});
                alert("Login successful! Welcome, " + data.author.name);
                this.handleCloseRegisterModal();
            } else {
                alert(`Login failed: ${data.error}`);
            }
        }).catch(error => {
            alert(`An error occurred: ${error.message}`);
        });
    };

    handleLogout = () => {
        localStorage.removeItem('authorUUID');
        this.setState({isLoggedIn: false});
        alert("You have been logged out.");
    };

    render() {
        const {isLoggedIn} = this.state;
        return (
            <>
                <Navbar sticky="top" collapseOnSelect expand="md" className='custom-navbar' variant="dark">
                    <Container fluid>
                        <Navbar.Brand href="/">
                            <img src={logo} className="d-inline-block align-top" alt="logo"/>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Form className='d-flex flex-column flex-md-row align-items-center w-100'>
                                <InputGroup className="position-relative mb-2 mb-md-0">
                                    <InputGroup.Text style={{backgroundColor: '#0D3040'}}>
                                        <img src={searchIcon} alt="Search" className="search-icon"
                                             style={{backgroundColor: '#0D3040'}}/>
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
                                            '::placeholder': {
                                                color: 'white',
                                                opacity: 1,
                                            }
                                        }}
                                    />
                                </InputGroup>
                                <div className="ms-md-auto">
                                    {isLoggedIn ? (
                                        <CustomButton onClick={this.handleLogout}>Выход</CustomButton>
                                    ) : (
                                        <CustomButton onClick={this.handleShowRegisterModal}>Я
                                            преподаватель</CustomButton>
                                    )}
                                </div>
                            </Form>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                <Modal show={this.state.showRegisterModal} onHide={this.handleCloseRegisterModal} size="md">
                    <Modal.Header closeButton>
                        <h5 style={{color: 'black'}}>Войдите, чтобы редактировать курсы</h5>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.handleLogin}>
                            <Form.Group controlId="uuid">
                                <Form.Control type="text" placeholder="Введите ваш UUID" name="uuid"
                                              value={this.state.uuid} onChange={this.handleInputChange}
                                              style={{width: '100%', height: '50px'}}/>
                            </Form.Group>
                            <Button type="submit" variant="primary" style={{
                                backgroundColor: '#50F1BE',
                                display: 'block',
                                width: '100%',
                                margin: '20px auto'
                            }}>
                                Войти в аккаунт
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}
