export const logout = () => {
    alert('Vui lòng đăng nhập lại để sử dụng dịch vụ!')
    localStorage.removeItem('auth_username');
    localStorage.removeItem('auth_expired_at');
    localStorage.removeItem('auth_token');
    window.location.reload()
};
  