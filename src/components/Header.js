import React, {useEffect, useState} from 'react';
import {Button, Container, Form, Modal, Navbar} from 'react-bootstrap';
import logo from '../resources/Logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomButton from './CustomButton';
import {fetchLogin} from "../api/securityApi";
import {useLocation, useNavigate} from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useLocation();
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
        const password = new FormData(event.target).get("password");

        if (password !== "admin") {
            alert("Неверный пароль!");
            return;
        }
        fetchLogin(uuid).then(data => {
            if (data.isValid) {
                localStorage.setItem('authorUUID', uuid);
                setIsLoggedIn(true);
                alert("Авторизация успешна, добро пожаловать " + data.author.name);
                handleCloseRegisterModal();
                window.location.reload();
            } else {
                alert(`Неуспешная авторизация: ${data.error}`);
            }
        }).catch(error => {
            alert(`Произошла ошибка: ${error.message}`);
        });
    };


    const handleLogout = () => {
        localStorage.removeItem('authorUUID');
        setIsLoggedIn(false)
        alert("You have been logged out.");
        window.location.reload();
    };

    const openSandbox = () =>{
        navigate(`/sandbox`)
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
                            <div className="ms-md-auto">
                                {isLoggedIn ? (
                                    <div>
                                        <CustomButton onClick={openSandbox}> Редактор кода </CustomButton>
                                        <CustomButton onClick={handleLogout}>Выход</CustomButton>
                                    </div>
                                ) : (
                                    <div>
                                        <CustomButton onClick={openSandbox}> Редактор кода </CustomButton>
                                        <CustomButton onClick={handleShowRegisterModal}>Я
                                        преподаватель</CustomButton>
                                    </div>
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
                    <Form onSubmit={handleLogin} className="d-flex flex-column align-items-center">
                        <Form.Group controlId="uuid" className="w-75">
                            <Form.Control type="text" placeholder="Логин" name="uuid" className="mb-3"/>
                        </Form.Group>
                        <Form.Group controlId="password" className="w-75">
                            <Form.Control type="password" placeholder="Пароль" name="password" className="mb-3"/>
                        </Form.Group>
                        <Button type="submit" variant="primary" className="w-75"
                                style={{backgroundColor: '#50F1BE', fontSize: '18px', fontWeight: 'bold'}}>
                            Войти в аккаунт
                        </Button>
                    </Form>

                </Modal.Body>
            </Modal>
        </>
    );
}

export default Header;
