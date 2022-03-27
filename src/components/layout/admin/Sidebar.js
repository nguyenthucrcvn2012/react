import React from "react";

import { useNavigate, NavLink } from "react-router-dom"
import axios from 'axios';
import Swal from 'sweetalert2'
import * as path from '../../../config/path'
import '../../../assets/js/scripts'

const Sidebar = () => {
    const navigate = useNavigate();

    const LogoutSubmit = (e) => {
        e.preventDefault();
        axios.get(`/sanctum/csrf-cookie`).then(response => {

            axios.post(`/api/logout`).then(res => {
               
                if(res.data.status === 200)
                {
                    // Remove store data
                    localStorage.removeItem('auth_username');
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('auth_expired_at');
                    Swal.fire(
                        'Đăng xuất',
                        'Thành công!',
                        'success'
                      )
                    navigate('/login');
                }
                else{
                    Swal.fire(
                        'Đăng xuất',
                        'Lỗi!',
                        'error'
                    )
                }
            })
        });
    }

    const closeMenu = () => {
        const body = document.querySelector('body')
        body.classList.remove('sb-sidenav-toggled')
    }
    return (
        <div id="layoutSidenav_nav">
            <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                <div className="sb-sidenav-menu">
                    <div className="nav" onClick={closeMenu}>
                        <NavLink className="nav-link  " to={path.PRODUCTS}>
                            <div className="sb-nav-link-icon"><i className="fa-brands fa-product-hunt"></i></div>
                            Sản phẩm
                        </NavLink>
                        <NavLink className="nav-link  " to={path.CUSTOMERS}>
                            <div className="sb-nav-link-icon"><i className="fa-solid fa-users"></i></div>
                            Khách hàng
                        </NavLink>
                        <NavLink className="nav-link  " to={path.USERS}>
                            <div className="sb-nav-link-icon"><i className="fa-solid fa-user-gear"></i></div>
                            Người dùng
                        </NavLink>
                        <span className="nav-link logout" onClick={LogoutSubmit}>
                            <div className="sb-nav-link-icon"><i className="fa-solid fa-right-from-bracket"></i>
                            </div>
                            Đăng xuất
                        </span>
                    </div>
                </div>
            </nav>

        </div>
    );
}

export default Sidebar;