import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Form} from "react-bootstrap";

import "../../assets/css/auth.css";
import Swal from 'sweetalert2'
import axios from 'axios';

function Login() {
    const [rememberLogin, setRememberLogin] = useState(false) //Check status user form
    const [validated, setValidated] = useState(false);

    const navigate = useNavigate();
    const [inputLogin, setLogin] = useState({
        email: '',
        password: '',
        remamber: '',
        error_list: [],
    });

    const handleRemember = () => {
        setRememberLogin(!rememberLogin)
    }

    const handleInput = (e) => {
        e.persist();
        setLogin({...inputLogin, [e.target.name]: e.target.value});
    }

    const loginSubmit = (event) => {
        event.preventDefault();
        
        const form = event.currentTarget;
        let check = 0;
        if (form.checkValidity() === false) {
            event.stopPropagation();
          check++;
        }
        setValidated(true);
        if(check === 0) {
            const data = {
                email: inputLogin.email,
                password: inputLogin.password,
                remember: rememberLogin,
            };
            axios.get(`/sanctum/csrf-cookie`).then(res => {
                axios.post(`/api/login`, data).then(res => {
                console.log(res)
                    if(res.data.status === 200)
                        {
                            console.log(res.data);
                            // To store data
                            localStorage.setItem('auth_username', res.data.user.name);
                            localStorage.setItem('auth_token', res.data.user.token);
                            localStorage.setItem('auth_expired_at', res.data.user.expired_at);

                            navigate('/admin');
                        }
                    else if(res.data.status === 401){
                        Swal.fire(
                            'Đăng nhập',
                            res.data.message,
                            'error'
                        )
                    }
                    else{
                        console.log(res.data);
                        setLogin({...inputLogin, error_list: res.data.validation_errors})
                    }
                })
            });
        }
    }
    return (
        <div>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header login">
                                <h4 >Đăng nhập</h4>
                            </div>
                            <div className="card-body">
                                <Form noValidate validated={validated} onSubmit={loginSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="">Tài khoản</label>
                                        <Form.Group className="mb-3" controlId="validation2">
                                            <Form.Control
                                                required
                                                type="email"
                                                name="email"
                                                placeholder="Nhập email"
                                                onChange={handleInput}
                                                value={inputLogin.email}
                                                />
                                            <span className="text-danger">{inputLogin.error_list.email}</span>
                                        </Form.Group>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="">Mật khẩu</label>
                                        <Form.Group className="mb-3" controlId="validation1">
                                            <Form.Control
                                                required
                                                type="password"
                                                name="password"
                                                placeholder="Nhập mật khẩu"
                                                onChange={handleInput}
                                                value={inputLogin.password}
                                                />
                                            <span className="text-danger">{inputLogin.error_list.password}</span>
                                        </Form.Group>
                                    </div>
                                    <div className="d-flex box-btn">
                                        <div className="form-check m-3">
                                            <input className="form-check-input" name="remember" type="checkbox" id="remember"
                                            onClick={handleRemember} />
                                            <label className="form-check-label" htmlFor="remember" >
                                                Lưu đăng nhập
                                            </label>
                                            </div>
                                        <button className="btn btn-primary m-3 btn-login" type="submit">Đăng nhập</button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;