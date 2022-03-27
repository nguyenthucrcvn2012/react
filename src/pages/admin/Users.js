import React, { useState, useEffect } from 'react'
import { Modal, Button, Form} from "react-bootstrap";
import axios from 'axios';

import "./../../../src/assets/css/admin.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

import Footer from "../../components/layout/admin/Footer";
import Navbar from "../../components/layout/admin/Navbar";
import Sidebar from "../../components/layout/admin/Sidebar";
import Navigation from '../../components/layout/admin/Navigation';
import Loading from '../../components/Loading';

function Users() {

    const NHANVIEN = 'Nhân viên';
    const ADMIN = 'Admin';
    const QUANLI = 'Quản lí';
    const [loading, setLoading] = useState(true); // loading
    const [users, setUsers] = useState([]); // Users
    const [pagination, setPagination] = useState({}); //Paginate
    const [checkedStatus, setCheckedStatus] = useState(false) //Check status user form
    const [titleForm, setTitleForm] = useState('Thêm mới user') //Title form
    const [isResearch, setIsResearch] = useState(true) // check is searching
    const [show, setShow] = useState(false);//set show modal
    const [validated, setValidated] = useState(false);
    const [inputSearch, setInputSearch] = useState({ //Form search
        name:  '',
        email:  '',
        group_role: '',
        is_active:  '',
    })

    const [user, setUser] = useState({ //form user
        id: '',
        name:  '',
        email:  '',
        password: '',
        password_confirm: '',
        group_role: '',
        error_list: []
    });

    //input search
    const handleInputSearch = (e) => {
        setInputSearch({ ...inputSearch, [e.target.name]: e.target.value })
    }

    //set status user
    const handleClickStatus = () => setCheckedStatus(!checkedStatus)

    //Submit filter
    const submitSearch = (e) => {
        if(inputSearch.name === '' && inputSearch.email === '' &&
        inputSearch.group_role === '' && inputSearch.is_active === '') 
        {
            Swal.fire('Tìm kiếm', 'Vui lòng nhập thông tin tìm kiếm!', 'warning')
        }
        else {
            e.preventDefault()
            filterData()
        }
    }
    //Enter filter
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if(inputSearch.name === '' && inputSearch.email === '' &&
            inputSearch.group_role === '' && inputSearch.is_active === '') 
            {
                Swal.fire('Tìm kiếm', 'Vui lòng nhập thông tin tìm kiếm!', 'warning')
            }
            else {
                e.preventDefault()
                filterData()
            }
        }
    }
    //Clear filter
    const handleDeleteSearch = () => {
        setIsResearch(false)
        setInputSearch({
            name:  '',
            email:  '',
            group_role: '',
            is_active:  '',
        })
        document.getElementById("SEARCH-FORM").reset();
        reloadPage(numPage)
    }

    //Filter
    const filterData = () => {
        setIsResearch(true)
        loadPage(1)
    }

    //Paginate
    var numPage; // Current page
    const callBackChildren = (num) => {
        numPage = num
        loadPage(numPage)
    }
   
    //set value input user
    const handleInput = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    //Delete user
    const deleteHandler = (email, id) => {

        Swal.fire({
            title: 'Xác nhận xóa',
            text: "Bạn có chắc chắn xóa tài khoản " + email + " không?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận!',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {

                axios.post(`api/users/${id}/delete`).then(res => {
                    if (res.data.status === 200) {
                        Swal.fire('Xóa!', res.data.message, 'success')
                        loadPage(numPage)
                    }
                    else if (res.data.status === 404) {
                        loadPage(numPage)
                        Swal.fire('Xóa!', res.data.message, 'error')
                    }
                });

            }
        })
        .catch(error => {
            Swal.fire('Lỗi', 'Lỗi kết nối, vui lòng thử lại sau', 'error')
        });
    }

    //Filter...
    const research = (numPage) => {
        const formData = new FormData();
        formData.append('name', inputSearch.name);
        formData.append('email', inputSearch.email);
        formData.append('is_active', inputSearch.is_active);
        formData.append('group_role', inputSearch.group_role);
        setLoading(true);
        axios.post(`api/users/search?page=${numPage}`, formData).then(res => {
            if (res.data.status === 200) {
                setUsers(res.data.users.data)
                setPagination({
                    current_page: res.data.users.current_page,
                    last_page: res.data.users.last_page,
                    to: res.data.users.to,
                    total: res.data.users.total,
                    from: res.data.users.from
                })
                setLoading(false);
            }
            else {
                Swal.fire('Tìm kiếm', res.data.message, 'error')
                setLoading(false);
            }
        })
        .catch(error => {
            Swal.fire('Lỗi', 'Lỗi kết nối, vui lòng thử lại sau', 'error')
        });
    }

    //Load page
    const reloadPage = (numPage) => {
        setLoading(true);
        axios.get(`/api/users?page=${numPage}`).then(res => {
            if (res.data.status === 200) {
                setUsers(res.data.users.data)
                setPagination({
                    current_page: res.data.users.current_page,
                    last_page: res.data.users.last_page,
                    to: res.data.users.to,
                    total: res.data.users.total,
                    from: res.data.users.from
                })
                setLoading(false);
            }
            else {
                setLoading(true);
            }
        })
        .catch(error => {
            Swal.fire('Lỗi', 'Lỗi kết nối, vui lòng thử lại sau', 'error')
        });
    }

    //Call api get list data
    const loadPage = (numPage) => {
        if(!isResearch) {
            reloadPage(numPage)
        }
        else{
            research(numPage)
        }
    }

    //Call api
    useEffect(() => {
        loadPage(numPage)
    }, []);

    //UnActive user
    const unAcitveHandler = (email, id) => {
        Swal.fire({
            title: 'Khóa tài khoản',
            text: "Bạn có chắc chắn khóa tài khoản " + email + " không?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận!',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`api/users/${id}/active`).then(res => {
                    if (res.data.status === 200) {
                        Swal.fire('Khóa!', res.data.message, 'success')
                        loadPage(numPage)
                    }
                    else if (res.data.status === 404 || res.data.status === 500) {
                        Swal.fire('Khóa!', res.data.message, 'error')
                    }
                });
            }
        })
        .catch(error => {
            Swal.fire('Lỗi', 'Lỗi kết nối, vui lòng thử lại sau', 'error')
        });
    }

    //Active User
    const acitveHandler = (email, id) => {

        Swal.fire({
            title: 'Mở Khóa tài khoản',
            text: "Bạn có chắc chắn mở khóa tài khoản " + email + " không?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận!',
            cancelButtonText: 'Hủy'
        })
        .then((result) => {
            if (result.isConfirmed) {

                axios.post(`api/users/${id}/active`).then(res => {
                    if (res.data.status === 200) {
                        Swal.fire('Mở Khóa!', res.data.message, 'success')
                        loadPage(numPage)
                    }
                    else if (res.data.status === 404 || res.data.status === 500) {
                        Swal.fire('Mở Khóa!', res.data.message, 'error')
                    }
                });

            }
        })
        .catch(error => {
            Swal.fire('Lỗi', 'Lỗi kết nối, vui lòng thử lại sau', 'error')
        });
    }

    //RENDER
    var tableHTML = ""
    if(loading){
        tableHTML =  (
            <td colSpan={6}>
                <Loading />
            </td>
        )
    }
    else{
        if(users.length > 0) {
            let numberUser = pagination.current_page * 10;
            tableHTML = 
             users?.map((user, idx) => {

                let numUser = idx + 1 + numberUser - 10 ;
                return (
                    <tr key={idx}>
                        <td>{numUser}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.group_role}</td>
                        <td>{user.is_active === 1 ? <span className='text-success'>Hoạt động</span> :
                            <span className='text-danger'>Tạm khóa</span>}</td>
                        <td className="text-center">
                            <span className='icon_btn' onClick={() => handleShow(user.id)}>
                                <i className="fa-solid fa-pencil"></i>
                            </span>
                            <span className='icon_btn' onClick={() => deleteHandler(user.email, user.id)}>
                                <i className="fa-solid fa-trash"></i>
                            </span>
                            {user.is_active === 1 ?
                                <span className='icon_btn' onClick={() => unAcitveHandler(user.email, user.id)}>
                                    <i className="fa-solid fa-user-check"></i>
                                </span>
                                :
                                <span className='icon_btn' onClick={() => acitveHandler(user.email, user.id)}>
                                    <i className="fa-solid fa-user-xmark"></i>
                                </span>
                            }
                        </td>
                    </tr>
                );
               
            })
        }
        else {
            tableHTML = (
                <tr ><td colSpan={6}>Không có dữ liệu</td> </tr>
            )
        }

    }

    // RESET DATA
    const resetInput = () => {
        setUser({
            id:  '',
            name:  '',
            email:  '',
            password: '',
            password_confirm: '',
            group_role: '',
            error_list: [] 
        })
        setCheckedStatus(false)
        setValidated(false)
    }

    //Store user
    const submitUser = (e) => {
        e.preventDefault()
        const data = {
            email: user.email,
            name: user.name,
            password: user.password,
            password_confirm: user.password_confirm,
            group_role: user.group_role,
            is_active: checkedStatus,
        }

        axios.post(`/api/users/store`, data)
        .then(res => {
            if(res.data.status === 200){
                handleDeleteSearch()
                Swal.fire('Thêm mới', res.data.message, 'success')
                setShow(false)
            }
            else if(res.data.status === 500){

                Swal.fire('Thêm mới', res.data.message, 'success')
            }
            else{

                setUser({...user, error_list: res.data.validation_errors})
            }
        })
        .catch(error => {
            setShow(false)
            Swal.fire('Lỗi', 'Lỗi kết nối, vui lòng thử lại sau', 'error')
        }); 

    }

    //Update user
    const submitUpdateUser = (e) => {
        e.preventDefault()
        const data = {
            email: user.email,
            name: user.name,
            group_role: user.group_role,
            is_active: checkedStatus,
        }
        axios.post(`/api/users/${user.id}/update`, data).then(res => {
            if(res.data.status === 200){
                Swal.fire('Cập nhật', res.data.message, 'success')
                resetInput()
                setShow(false)
                loadPage(numPage)
            }
            else if(res.data.status === 404 || res.data.status === 500){
                loadPage(numPage)
                setShow(false)
                Swal.fire('Cập nhật', res.data.message, 'error')
            }
            else{
                setUser({...user, error_list: res.data.validation_errors})
            }
        })
        .catch(error => {
            setShow(false)
            Swal.fire('Lỗi', 'Lỗi kết nối, vui lòng thử lại sau', 'error')
        })
    }
    
    //Close modal
    const handleClose = () => {
        resetInput()
        setShow(false)
    };
    
    //show modal
    const handleShow = (id) => {
        // resetInput()
        if(Number.isInteger(id)) {
            axios.get(`/api/users/${id}`).then(res => {
                // console.log(res.data)
                if(res.data.status === 200){
                    setTitleForm('Chỉnh sửa user')
                    setUser({
                        id: res.data.user.id,
                        name: res.data.user.name,
                        email: res.data.user.email,
                        password: res.data.user.password,
                        password_confirm: res.data.user.password,
                        group_role: res.data.user.group_role,
                        error_list: []
                    })
                    setCheckedStatus(res.data.user.is_active)
                    setShow(true)
                }
                else if(res.data.status === 404){
                    Swal.fire('Lỗi', res.data.message, 'warning')
                    loadPage(numPage)
                }
            }); 
        }
        else{
            resetInput()
            setTitleForm('Thêm mới user')
            setShow(true)
        }
    };

    //Submit form
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        let check = 0;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
          check++;
        }
        setValidated(true);
        if(check === 0) {
            user.id === '' ?  submitUser(event) : submitUpdateUser(event)
        }
      };
    return (
        <div className="sb-nav-fixed">

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{titleForm}</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form noValidate validated={validated} onSubmit={handleSubmit} id="USER_FORM">
                        <table className="w-100">
                            <thead></thead>
                        <tbody>
                            <tr>
                                <td scope="row">Tên <span className='text-danger'>*</span></td>
                                <td scope="col">
                                    <Form.Group className="mb-3" controlId="validationCustom05">
                                        <Form.Control
                                            required
                                            type="text"
                                            name="name"
                                            placeholder="Nhập họ tên"
                                            onChange={handleInput}
                                            value={user.name}
                                            />
                                        <span className="invalid">{user.error_list.name}</span>
                                    </Form.Group>
                                </td>
                            </tr>
                            <tr>
                                <td scope="row">Email <span className='text-danger'>*</span></td>
                                <td scope="col">
                                    <Form.Group className="mb-3" controlId="validation2">
                                        <Form.Control
                                            required
                                            type="email"
                                            name="email"
                                            placeholder="Nhập email"
                                            onChange={handleInput}
                                            value={user.email}
                                            />
                                        <span className="invalid">{user.error_list.email}</span>
                                    </Form.Group>
                                </td>
                            </tr>
                            <tr>
                                <td scope="row">Mật khẩu {user.id === '' ?  <span className='text-danger'>*</span> : '*'}</td>
                                <td scope="col">
                                    {/* <input type="password" disabled={user.id == '' ? '' : 'disabled'}   name="password" onChange={handleInput} value={user.password} 
                                    className="form-control" placeholder="Nhập mật khẩu" /> */}
                                    <Form.Group className="mb-3" controlId="validation2">
                                        <Form.Control
                                            required
                                            type="password"
                                            name="password"
                                            placeholder="Nhập mật khẩu"
                                            onChange={handleInput}
                                            value={user.password}
                                            disabled={user.id === '' ? '' : 'disabled'}
                                            />
                                        <span className="invalid">{user.error_list.password}</span>
                                    </Form.Group>
                                </td>
                            </tr>
                            <tr>
                                <td scope="row">Mật khẩu xác nhận {user.id === '' ?  <span className='text-danger'>*</span> : '*'}</td>
                                <td scope="col">
                                    {/* <input type="password" disabled={user.id == '' ? '' : 'disabled'} name="password_confirm" value={user.password_confirm} 
                                    onChange={handleInput} className="form-control" placeholder="Xác nhận nhận mật khẩu" /> */}
                                    <Form.Group className="mb-3" controlId="validation2">
                                        <Form.Control
                                            required
                                            type="password"
                                            name="password_confirm"
                                            placeholder="Xác nhận nhận mật khẩu"
                                            onChange={handleInput}
                                            value={user.password_confirm}
                                            disabled={user.id === '' ? '' : 'disabled'}
                                            />
                                        <span className="invalid">{user.error_list.password_confirm}</span>
                                    </Form.Group>
                                </td>
                            </tr>
                            <tr>
                                <td scope="row">Nhóm <span className='text-danger'>*</span></td>
                                <td scope="col">
                                    <Form.Group className="mb-3">
                                        <Form.Control required as="select" className="form-select" value={user.group_role}  name="group_role" onChange={handleInput}
                                            aria-label="Default select example">
                                            <option value="" >Chọn nhóm</option>
                                            <option value={ADMIN} >Admin</option>
                                            <option value={NHANVIEN} >Nhân viên</option>
                                            <option value={QUANLI} >Quản lí</option>
                                        </Form.Control>
                                        <span className="text-alert">{user.error_list.group_role}</span>
                                    </Form.Group>
                                </td>
                            </tr>
                            <tr>
                                <td scope="row">Trạng thái</td>
                                <td scope="col">
                                    <input className="form-check-input" type="checkbox" checked={checkedStatus} 
                                    name="is_active" onChange={handleClickStatus} />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Đóng
                            </Button>
                            <Button variant="primary" type="submit">
                                Lưu
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>

            <Navbar />

            <div id="layoutSidenav">

                <Sidebar />

                <div id="layoutSidenav_content">
                    <main>
                        <div className="container-fluid px-4">
                            <div className="card mb-4  mt-4">
                                <div className="card-header">
                                    <span>
                                        <i className="fas fa-table me-1"></i>
                                        Danh sách người dùng
                                    </span>
                                    <button className="btn btn-primary btn-search  m-1" onClick={() => handleShow()}>
                                        <i className="fa-solid fa-plus"></i> Thêm mới
                                        </button>
                                </div>
                                <div className="card-body">

                                <div className="box-search mt-1">
                                    <form id="SEARCH-FORM">
                                        <div className="row p-3">
                                            <div className="col-md-3 mb-1">
                                                <label htmlFor="name">Tên</label>
                                                <input type="text" name="name" value={inputSearch.name}  onKeyPress={handleKeyDown}
                                                className="form-control"  onChange={handleInputSearch} placeholder='Nhập họ tên'/>   
                                            </div>
                                            <div className="col-md-3 mb-1">
                                                <label htmlFor="name">Email</label> 
                                                <input type="text"  name="email"  value={inputSearch.email}  className="form-control" 
                                                 onChange={handleInputSearch} placeholder='Nhập email' onKeyPress={handleKeyDown}/>   
                                            </div>
                                            <div className="col-md-3  mb-1">
                                                <label htmlFor="status">Nhóm</label>
                                                <select className="form-select" id="status" name="group_role" onChange={handleInputSearch}
                                                  aria-label="Default select example">
                                                <option value="" >Chọn nhóm</option>
                                                <option value="Admin">Admin</option>
                                                <option value="Nhân viên">Nhân viên</option>
                                                <option value="Quản lí">Quản lí</option>
                                                </select>
                                            </div>
                                            <div className="col-md-3  mb-1">
                                                <label htmlFor="status">Trạng thái</label>
                                                <select className="form-select" id="status" name="is_active"  
                                                onChange={handleInputSearch}  aria-label="Default select example">
                                                <option value="" >Chọn trạng thái</option>
                                                <option value="1">Đang hoạt động</option>
                                                <option value="0">Tạm khóa</option>
                                                </select>
                                            </div>
                                            <div className="col-md-12 mb-1 box-btn-search mt-4">
                                                <button type="button"  className="btn btn-primary btn-search  m-1" onClick={submitSearch}>
                                                    <i className="fa-solid fa-magnifying-glass"></i>
                                                    </button>
                                                &nbsp;
                                                {/* {isResearch ? <BtnClearSearch /> : ''} */}
                                                <button type="button"  className="btn btn-danger btn-search  m-1" onClick={handleDeleteSearch}>
                                                    <i className="fa-solid fa-x"></i> Xóa tìm
                                                </button>
                                                {/* &nbsp;
                                                <button className="btn btn-primary btn-search  m-1" onClick={() => handleShow()}>
                                                    <i className="fa-solid fa-plus"></i> Thêm mới
                                                    </button> */}
                                            </div>
                                        </div>

                                    </form>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Họ tên</th>
                                                    <th>Email</th>
                                                    <th>Nhóm</th>
                                                    <th>Trạng thái</th>
                                                    <th className="text-center">Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                { tableHTML }
                                            </tbody>
                                        </table>
                                        <Navigation Paginate={pagination}  childToParent={callBackChildren}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default Users;