import React from "react";
import Footer  from "../../components/layout/admin/Footer";
import Navbar  from "../../components/layout/admin/Navbar";
import Sidebar  from "../../components/layout/admin/Sidebar";

const MasterLayout = () => {
    let user = localStorage.getItem('auth_username');
    return (
        <div className="sb-nav-fixed">
            <Navbar />
            <div id="layoutSidenav">
                <Sidebar />
                <div id="layoutSidenav_content">
                    <main>
                        <div className="container-fluid px-4">  
                         <h3 className="p-3">Xin chào {user ? user + ' !' : ''}</h3>
                        </div>
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default MasterLayout;