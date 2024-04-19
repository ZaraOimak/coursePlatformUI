import React, {useEffect, useState} from 'react';
import {Button, Container, Form, FormControl, InputGroup, Modal, Navbar} from 'react-bootstrap';
import logo from '../resources/Logo.svg';
import searchIcon from '../resources/Search.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomButton from './CustomButton';
import {fetchLogin} from "../api/securityApi";

const Header = () => {
    const [searchText, setSearchText] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('authorUUID')) {
            setIsLoggedIn(true);
        }

    }, []);
    const handleShowRegisterModal = () => {
        setShowLoginModal(true);
    }

    const handleCloseRegisterModal = () => {
        setShowLoginModal(false);
    }

    const handleLogin = (event) => {
        event.preventDefault();
        const uuid = new FormData(event.target).get("uuid");

        fetchLogin(uuid).then(data => {
            if (data.isValid) {
                localStorage.setItem('authorUUID', uuid);
                setIsLoggedIn(true);
                alert("Login successful! Welcome, " + data.author.name);
                handleCloseRegisterModal();
                window.location.reload();
            } else {
                alert(`Login failed: ${data.error}`);
            }
        }).catch(error => {
            alert(`An error occurred: ${error.message}`);
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('authorUUID');
        setIsLoggedIn(false)
        alert("You have been logged out.");
        window.location.reload();
    };

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
                                    value={searchText}
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
                                    <CustomButton onClick={handleLogout}>Выход</CustomButton>
                                ) : (
                                    <CustomButton onClick={handleShowRegisterModal}>Я
                                        преподаватель</CustomButton>
                                )}
                            </div>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Modal show={showLoginModal} onHide={handleCloseRegisterModal} size="md">
                <Modal.Header closeButton>
                    <h5 style={{color: 'black'}}>Войдите, чтобы редактировать курсы</h5>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleLogin}>
                        <Form.Group controlId="uuid">
                            <Form.Control type="text" placeholder="Введите ваш UUID" name="uuid"
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

export default Header;
