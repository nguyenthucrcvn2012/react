import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

export default function PublicRoute() {
    let  userid = localStorage.getItem("auth_token") == null ? false : true;
    return (
        <>
            {userid ?  <Navigate to="/admin" /> : <Outlet  /> };
        </>
    )

}