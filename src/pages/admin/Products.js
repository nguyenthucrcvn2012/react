import React, { useState, useRef, useEffect } from 'react'
import { Modal, Button, Form, Col, Row} from "react-bootstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic/';

import Footer from "../../components/layout/admin/Footer";
import Navbar from "../../components/layout/admin/Navbar";
import Sidebar from "../../components/layout/admin/Sidebar";
import Navigation from '../../components/layout/admin/Navigation';
import Loading from '../../components/Loading';
import axios from 'axios';
import Swal from "sweetalert2";
import ReactHtmlParser from 'react-html-parser';

function Product() {

    const HETHANG = 2;
    const NGUNGBAN = 0;
    const DANGBAN = 1;
    var noimg = require('../../assets/images/noimage.png') //image default

    const [validated, setValidated] = useState(false); // Validate Form
    const [loading, setLoading] = useState(true); // Loading
    const [products, setProducts] = useState([]); // Products
    const [pagination, setPagination] = useState({});//Paginate
    const [titleForm, setTitleForm] = useState('Thêm mới sản phẩm') //Title form add/edit
    const [isResearch, setIsResearch] = useState(true) //check is searching
    const [show, setShow] = useState(false); // set Show Modal
    const [isDeleteImage, setIsDeleteImage] = useState(false) // Check Image 
    const [imgData, setImgData] = useState(noimg);
    const [inputSearch, setInputSearch] = useState({ //Input search
        product_name: '',
        is_sales: '',
        price_to: '',
        price_from: ''
    })
    const [productImage, setProductImage] = useState({ // Image Product
        image: null,
        name: ''
    })
    const [product, setProduct] = useState({ // Product
        product_id: '',
        product_name: '',
        product_image: '',
        product_price: '',
        description: '',
        is_sales: '',
        error_list: []
    });

    //filter
    const handleInputSearch = (e) => {
        setInputSearch({ ...inputSearch, [e.target.name]: e.target.value })
        // console.log(inputSearch)
    }

    //Submit filter
    const submitSearch = (e) => {
        if(inputSearch.product_name === '' && inputSearch.is_sales === '' &&
        inputSearch.price_to === '' && inputSearch.price_from === '') 
        {
            Swal.fire('Tìm kiếm', 'Vui lòng nhập thông tin tìm kiếm!', 'warning')
        }
        else {
            e.preventDefault();
            filterData()
            // console.log(inputSearch)
        }
    }

    //Enter filter
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            filterData()
            // console.log(inputSearch)
        }
    }

    //clear filter
    const handleDeleteSearch = () => {
        setIsResearch(false)
        setInputSearch({
            product_name: '',
            is_sales: '',
            price_to: '',
            price_from: ''
        })
        document.getElementById("SEARCH-FORM").reset();
        reloadPage(numPage)
    }

    //Search...
    const filterData = () => {
        if(inputSearch.product_name === '' && inputSearch.is_sales === '' &&
        inputSearch.price_to === '' && inputSearch.price_from === '') 
        {
            Swal.fire('Tìm kiếm', 'Vui lòng nhập thông tin tìm kiếm!', 'warning')
        }
        else {
            setIsResearch(true)
            loadPage(1)
        }
    }

    //input product
    const handleInput = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value })
        console.log(product)
    }

    //format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    }


    //Event click  image
    const inputFileRef = useRef(null);

    //Event Choose Image
    const chooseImage = (e) => {
        inputFileRef.current.click();
    }

    // Event change image
    const onChangePicture = (e) => {
        if (e.target.files[0]) {
            setIsDeleteImage(false)
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImgData(reader.result);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    //image product
    const handleImage = (e) => {
        setProductImage({
            image : e.target.files[0],
            name : e.target.files[0].name
        })
        onChangePicture(e)
    }

    //delete image product
    const removeImage = () => {
        setImgData(noimg)
        setProductImage({
            image: null,
            name: ''
        })
        setIsDeleteImage(true)

    }

    //Close modal
    const handleClose = () => {
        resetInput()
        setShow(false)
    };

    //Open modal
    const handleShow = (id) => {
        if (id) {
            axios.get(`/api/products/${id}`).then(res => {
                if (res.data.status === 200) {
                    setTitleForm('Chỉnh sửa sản phẩm')

                    setProduct({
                        product_id: res.data.product.product_id,
                        product_name: res.data.product.product_name,
                        product_image: '',
                        product_price: res.data.product.product_price,
                        description: res.data.product.description === null ? '' : res.data.product.description,
                        is_sales: res.data.product.is_sales,
                        error_list: []
                    })
                    if (res.data.product.product_image !== null) {
                        setImgData(res.data.product.product_image);
                    }
                    setShow(true)
                }
                else if (res.data.status === 404) {
                    Swal.fire('Lỗi', res.data.message, 'warning')
                    loadPage(numPage)
                }
            })
            .catch(error => {
                setShow(false)
                Swal.fire('Lỗi', 'Lỗi kết nối, vui lòng thử lại sau', 'error')
            });
        }
        else {
            resetInput()
            setTitleForm('Thêm mới sản phẩm')
            setShow(true)
        }
    }
    //RESET DATA
    const resetInput = () => {
        setProduct({
            product_id: '',
            product_name: '',
            product_price: '',
            product_image: '',
            description: '',
            is_sales: '',
            error_list: []
        })
        removeImage()
        setValidated(false);
    }

    //RENDER DATA
    var tableHTML = ""
    if (loading) {
        tableHTML = (
            <td colSpan={6}>
                <Loading />
            </td>
        )
    }
    else if (products.length > 0) {
        let numberProduct = pagination.current_page * 10;
        tableHTML = products?.map((pro, idx) => {
            let numPro = idx + 1 + numberProduct - 10;
            return (
                <tr key={idx}>
                    <td>{numPro}</td>
                    <td >{pro.product_id}</td>
                    <td className='td-product-name'>
                        {pro.product_name}
                        <img className='display-image-product' src={pro.product_image} alt="" />
                    </td>
                    <td className="" style={{ maxWidth: '200px'}}>
                        <span className="text-split-1 content-description">
                        {ReactHtmlParser(pro.description)}
                        </span>
                    </td>
                    <td>{formatPrice(pro.product_price)}</td>
                    <td>
                        {pro.is_sales === DANGBAN ?
                            <span className='text-success'>Đang bán</span> : pro.is_sales  === NGUNGBAN ?
                            <span className='text-danger'>Ngừng bán</span> :
                            <span className='text-danger'>Hết hàng</span>
                        }
                    </td>
                    <td className="text-center">
                        <span className='icon_btn' onClick={() => handleShow(pro.product_id)}>
                            <i className="fa-solid fa-pencil"></i>
                        </span>
                        <span className='icon_btn'>
                            <i className="fa-solid fa-trash" onClick={(e) => deleteHandler(e, pro.product_id, pro.product_name)}></i>
                        </span>
                    </td>
                </tr>
            );
        })
    }
    else {
        tableHTML = (
            <tr ><td colSpan={7}>Không có dữ liệu</td> </tr>
        )
    }

    //Update product
    const submitUpdateProduct = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('product_name', product.product_name);
        formData.append('product_price', product.product_price);
        formData.append('description', product.description);
        formData.append('is_sales', product.is_sales);
        formData.append('product_image', productImage.image);
        formData.append('is_delete_image', isDeleteImage);
        axios.post(`/api/products/${product.product_id}/update`, formData)
        .then(res => {
            if (res.data.status === 200) {
                // console.log(res.data)
                Swal.fire('Cập nhật sản phẩm', res.data.message, 'success')
                loadPage(numPage)
                setShow(false)
                resetInput()
                setProduct({
                    product_id: '',
                    product_name: '',
                    product_image: '',
                    product_price: '',
                    description: '',
                    is_sales: '',
                    error_list: []
                })
            }
            else if (res.data.status === 500 || res.data.status === 404) {
                Swal.fire('Cập nhật sản phẩm', res.data.message, 'error')
                setShow(false)
                resetInput()
                loadPage(numPage)
            }
            else {

                setProduct({ ...product, error_list: res.data.validation_errors })
            }
        })
        .catch(error => {
            setShow(false)
            Swal.fire('Lỗi', 'Lỗi kết nối, vui lòng thử lại sau', 'error')
        });
    }

    //Store product
    const submitStoreProduct = (e) => {
        e.preventDefault()

        const formData = new FormData();
        formData.append('product_name', product.product_name);
        formData.append('product_price', product.product_price);
        formData.append('description', product.description);
        formData.append('is_sales', product.is_sales);
        formData.append('product_image', productImage.image);

        axios.post(`/api/products/store`, formData)
        .then(res => {
            if (res.data.status === 200) {
                Swal.fire('Thêm mới', res.data.message, 'success')
                loadPage(numPage)
                setShow(false)
                resetInput()
            }
            else if (res.data.status) {
                Swal.fire('Thêm mới', res.data.message, 'warning')
                loadPage(numPage)
            }
            else {

                setProduct({ ...product, error_list: res.data.validation_errors })
            }
        })
        .catch(error => {
            setShow(false)
            Swal.fire('Lỗi', 'Lỗi kết nối, vui lòng thử lại sau', 'error')
        });
        setValidated(true);
    }

    //Paginate
    var numPage; // current page
    const callBackChildren = (num) => {
        numPage = num
        // console.log(numPage)
        loadPage(numPage)
    }

    // Call api get Products
    const loadPage = (numPage) => {
        if (!isResearch) {
            reloadPage(numPage)
        }
        else {
            research(numPage)
        }
    }

    const reloadPage = (numPage) => {
        setLoading(true);
        axios.get(`/api/products?page=${numPage}`)
        .then(res => {
            if (res.data.status === 200) {
                // console.log(res.data)
                setProducts(res.data.products.data)
                setPagination({
                    current_page: res.data.products.current_page,
                    last_page: res.data.products.last_page,
                    to: res.data.products.to,
                    total: res.data.products.total,
                    from: res.data.products.from
                })
                setLoading(false);
            }
            else {
                Swal.fire('Tìm kiếm', res.data.message, 'warning')
                setLoading(false);
            }
        })
        .catch(error => {
            Swal.fire('Lỗi', 'Lỗi kết nối, vui lòng thử lại sau', 'error')
        });
    }

    //call api filter
    const research = (numPage) => {
        const formData = new FormData();
        formData.append('product_name', inputSearch.product_name);
        formData.append('is_sales', inputSearch.is_sales);
        formData.append('price_to', inputSearch.price_to);
        formData.append('price_from', inputSearch.price_from);

        setLoading(true);
        axios.post(`api/products/search?page=${numPage}`, formData)
        .then(res => {
            if (res.data.status === 200) {
                // console.log(res.data)
                setProducts(res.data.products.data)
                setPagination({
                    current_page: res.data.products.current_page,
                    last_page: res.data.products.last_page,
                    to: res.data.products.to,
                    total: res.data.products.total,
                    from: res.data.products.from
                })
                setLoading(false);
            }
            else {
                Swal.fire('Tìm kiếm', res.data.message, 'warning')
                setLoading(false);
            }
        })
        .catch(error => {
            setShow(false)
            Swal.fire('Lỗi', 'Lỗi kết nối, vui lòng thử lại sau', 'error')
        });
    }

    //Delete product
    const deleteHandler = (e, id, name) => {
        Swal.fire({
            title: 'Xác nhận xóa',
            text: `Bạn có chắc chắn xóa sản phẩm "${name}" không?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận!',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {

                axios.post(`api/products/${id}/delete`).then(res => {
                    if (res.data.status === 200) {
                        Swal.fire('Xóa!', res.data.message, 'success')
                        loadPage(numPage)
                    }
                    else if (res.data.status) {
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

    //Loading table
    useEffect(() => {
        loadPage(numPage);
    }, []);

    //Submit form product
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        var check = 0;
        if (form.checkValidity() === false) {

          event.preventDefault();
          event.stopPropagation();
          check++
        }
        setValidated(true);
        if(check === 0) { //is validate success
            product.product_id !== '' ? submitUpdateProduct(event) : submitStoreProduct(event)
        }
      };

    // const [dataCk, setDataCk] = useState("")
    const handleCkeditor = (event, editor) => {
        const data = editor.getData();

        setProduct({...product, description: data})
    }

    return (
        <div className="sb-nav-fixed">
            <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{titleForm}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit} encType="multipart/form-data" >
                        <Row className="mb-3">
                            <Form.Group as={Col}  md="7">
                                
                                <Form.Group controlId="validationCustom01" className="mb-3">
                                    <Form.Label>Tên sản phẩm <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Nhập tên sản phẩm"
                                        className="form-control"
                                        name="product_name"
                                        value={product.product_name} onChange={handleInput}
                                        maxLength="25"
                                    />
                                    <span className="invalid">{product.error_list.product_name}</span>
                                </Form.Group>
                                <Form.Group controlId="validationCustom02" className="mb-3">
                                    <Form.Label>Giá sản phẩm <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        required
                                        type="number"
                                        placeholder="Giá sản phẩm"
                                        name="product_price" 
                                        value={product.product_price ? Number(product.product_price).toFixed(0) : ''}
                                        onChange={handleInput}
                                        onInput = {(e) =>{
                                            e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,11)
                                          }}
                                    />
                                    <span className="invalid">{product.error_list.product_price}</span>
                                </Form.Group>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label>Trạng thái <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control required as="select" value={product.is_sales} onChange={handleInput} name="is_sales">
                                        <option value="" >Chọn trạng thái</option>
                                        <option value="1" >Đang bán</option>
                                        <option value="0" >Ngừng bán</option>
                                        <option value="2" >Hết hàng</option>
                                    </Form.Control>
                                    <span className="invalid">{product.error_list.is_sales}</span>
                                </Form.Group>
                            </Form.Group>
                            <Form.Group as={Col}  md="5">
                                <h5>Hình ảnh</h5>
                                <input type="file" id="file" accept=".png, .jpg, .jpeg" multiple name="product_image" hidden onChange={handleImage} className="mb-3" ref={inputFileRef} />
                                <div className="image-review" id="REVIEW-IMAGE">
                                    <img onClick={chooseImage} src={imgData} alt="" />
                                </div>
                                <span className="text-alert">{product.error_list.product_image}</span>
                                <div className="box-upload-image mt-3">
                                    <button type='button' className='btn-upload btn-primary' onClick={chooseImage}>Upload</button>
                                    <button type='button' className='btn-remove btn-danger' onClick={removeImage}>Xóa file</button>
                                    <input type="text" placeholder='Tên file' value={productImage.name} disabled />
                                </div>
                            </Form.Group>
                            <Form.Group controlId="validationCustom01" className="mb-3">
                                    <Form.Label>Mô tả sản phẩm </Form.Label>
                                    <CKEditor 
                                        
                                        name="description"
                                        as="textarea"
                                        rows={4}
                                        editor={ ClassicEditor }
                                        data={product.description}
                                        onChange={handleCkeditor}
                                    />
                                    <span className="invalid">{product.error_list.description}</span>
                                </Form.Group>
                        </Row>
                        <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Đóng
                                </Button>
                                <Button type="submit"
                                >
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

                            <div className="card mb-4 mt-4">

                                <div className="card-header">
                                    <span>
                                        <i className="fas fa-table me-1"></i>
                                        Danh sách sản phẩm
                                    </span>
                                    <button className="btn-primary btn btn-search  m-1" onClick={() => handleShow()}><i className="fa-solid fa-plus"></i> Thêm mới</button>
                                </div>
                                <div className="card-body">

                                    <form action="" id="SEARCH-FORM">

                                        <div className="box-search mt-1">
                                            <div className="row p-3">
                                                <div className="col-md-3 mb-1">
                                                    <label htmlFor="name">Tên sản phẩm</label>
                                                    <input type="text" name="product_name" className="form-control"
                                                        value={inputSearch.product_name} onChange={handleInputSearch}
                                                        placeholder='Nhập tên sản phẩm' onKeyPress={handleKeyDown} />
                                                </div>
                                                <div className="col-md-3  mb-1">
                                                    <label htmlFor="status">Trạng thái</label>
                                                    <select className="form-select" name="is_sales" onChange={handleInputSearch} aria-label="Default select example">
                                                        <option value="" >Chọn trạng thái</option>
                                                        <option value={DANGBAN}>Đang bán</option>
                                                        <option value={NGUNGBAN}>Ngừng bán</option>
                                                        <option value={HETHANG}>Hết hàng</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-3 col-6 mb-1">
                                                    <label htmlFor="price_from">Giá bán từ</label>
                                                    <Form.Control
                                                        required
                                                        type="number"
                                                        name="price_from" 
                                                        onChange={handleInputSearch}
                                                        onKeyPress={handleKeyDown}
                                                        value={inputSearch.price_from}
                                                        onInput = {(e) =>{
                                                            e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,11)
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-md-3 col-6 mb-1">
                                                    <label htmlFor="price_to">Giá bán đến</label>
                                                    <Form.Control
                                                        required
                                                        type="number"
                                                        name="price_to" 
                                                        onChange={handleInputSearch}
                                                        onKeyPress={handleKeyDown}
                                                        value={inputSearch.price_to}
                                                        onInput = {(e) =>{
                                                            e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,11)
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-md-12 col-12 mb-1 box-btn-search mt-4">
                                                    <button type="button" className="btn btn-primary btn-search  m-1" onClick={submitSearch}><i className="fa-solid fa-magnifying-glass"></i></button>
                                                    &nbsp;
                                                    <button type="button" className="btn btn-danger btn-search  m-1" onClick={handleDeleteSearch}><i className="fa-solid fa-x"></i> Xóa tìm</button>
                                                    &nbsp;
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Mã sản phẩm</th>
                                                    <th>Tên sản phẩm</th>
                                                    <th>Mô tả</th>
                                                    <th>Giá</th>
                                                    <th>Tình trạng</th>
                                                    <th className="text-center">Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    tableHTML ? tableHTML : <tr ><td colSpan={6}>Không có dữ liệu</td> </tr>
                                                }
                                            </tbody>
                                        </table>
                                        <Navigation Paginate={pagination} childToParent={callBackChildren} />
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

export default Product;