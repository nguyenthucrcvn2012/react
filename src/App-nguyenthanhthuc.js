import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Link,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';
import axios from 'axios';

import "bootstrap/dist/css/bootstrap.min.css";
import "./../src/assets/css/admin.css";
import "./assets/css/styles.css";
import "./assets/js/scripts";

import MasterLayout from './layouts/admin/MasterLayout';  

import Products from './components/admin/Products';
import Customers from './components/admin/Customers';
import Users from './components/admin/Users';
import Login from './components/auth/Login';
import Orders from './components/admin/Orders';
import Page404 from './components/pages/Page404';

import PrivateRoute from './components/routing/PrivateRoute';
import PublicRoute from './components/routing/PublicRoute';

axios.defaults.baseURL = 'http://localhost:8000/';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.withCredentials = true;
axios.interceptors.request.use(function(config){

  const token = localStorage.getItem('auth_token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
})


function App() {
    
  return (
    
    <div className="App">

      <Router>
        <Routes>

              <Route path='*' element={<Page404 />} />
              <Route exact element={<PublicRoute  />}>
                <Route path="/login" element={<Login />} />
              </Route >
                
              <Route exact element={<PrivateRoute  />}>
                <Route path="/admin" element={<MasterLayout />} />
                <Route path="/admin/order-management" name="Admin" element={<Orders />} />
                <Route path="/admin/product-management" name="Products" element={<Products />} />
                <Route path="/admin/customer-management" name="Customers" element={<Customers />} />
                <Route path="/admin/user-management" name="Users" element={<Users />} />
              </Route>

        </Routes>
      </Router>
    </div>
  );
}

export default App;
