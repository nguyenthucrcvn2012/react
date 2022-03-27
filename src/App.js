import React from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

// style
import "bootstrap/dist/css/bootstrap.min.css";
import "./../src/assets/css/admin.css";
import "./assets/css/styles.css";
import "./assets/js/scripts";

// lib format
import moment from 'moment';

// pages
import MasterLayout from './pages/admin/MasterLayout';  
import Products from './pages/admin/Products';
import Customers from './pages/admin/Customers';
import Users from './pages/admin/Users';
import Login from './pages/auth/Login';
import Page404 from './pages/Page404';

// config route public, private, path
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import * as path from './config/path'

// config axios default
axios.defaults.baseURL = 'http://localhost:8000/';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.withCredentials = true;
axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('auth_token');
    config.headers.Authorization =  token ? `Bearer ${token}` : '';
    return config;
});

// check connect server
let expiredAt = localStorage.getItem('auth_expired_at');
const nowTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');;
if(expiredAt && nowTime) {
  // console.log(expiredAt)
  // console.log(nowTime.toLocaleString())
  if (expiredAt < nowTime ){
    localStorage.removeItem('auth_username');
    localStorage.removeItem('auth_expired_at');
    localStorage.removeItem('auth_token');
    alert('Lỗi vui lòng đăng nhập lại')
  }
}

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='*' element={<Page404 />} />
          <Route exact element={<PublicRoute  />}>
            <Route path={path.LOGIN} element={<Login />} />
          </Route >
          <Route exact element={<PrivateRoute  />}>
            <Route path={path.TOP} element={<MasterLayout />} />
            <Route path={path.PRODUCTS} name="Products" element={<Products />} />
            <Route path={path.CUSTOMERS} name="Customers" element={<Customers />} />
            <Route path={path.USERS} name="Users" element={<Users />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
