import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

export default function PrivateRoute() {
    
    let  userid = localStorage.getItem("auth_token") == null ? false : true;
    return (
        <>
            {userid ? <Outlet  /> : <Navigate to="/login" />};
        </>

    )
}