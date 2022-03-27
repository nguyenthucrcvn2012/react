import React from "react";
import { Link } from "react-router-dom"
import {TOP}  from '../../../config/path'

const Navbar = () => {

    let user = localStorage.getItem('auth_username');
    return (
       
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            <Link className="navbar-brand ps-3" to={TOP}>React Laravel</Link>
            <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" to="#!"><i className="fas fa-bars"></i></button>
            <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
                <div className="input-group">

                </div>
            </form>
            <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                <li className="nav-item dropdown">
                    <Link className="nav-link " id="navbarDropdown" to="#" role="button"
                     data-bs-toggle="dropdown" aria-expanded="false">
                         <i className="fas fa-user fa-fw">
                        </i>{user}</Link>
                </li>
            </ul>
            
        </nav>

    );
}

export default Navbar;