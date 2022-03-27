import React from 'react'
import { Link } from 'react-router-dom';

import "../assets/css/404.css";
import * as path from '../config/path'

function Page404() {

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="error-template">
                            <h1>
                                Oops!
                            </h1>
                            <h2>
                                404 Not Found</h2>
                            <div className="error-details">
                                Không tìm thấy trang bạn tìm kiếm
                            </div>
                            <div className="error-actions">
                                <Link to="/admin" className="btn btn-primary btn-lg">
                                    <span className="glyphicon glyphicon-home"></span>
                                    Về trang chủ </Link><Link to={path.TOP} className="btn btn-default btn-lg">
                                <span className="glyphicon glyphicon-envelope"></span> Đăng kí tài khoản </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Page404;