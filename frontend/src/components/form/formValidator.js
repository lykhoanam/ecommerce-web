export function validateLogin(values) {
  const errors = {};

  // Validate email
  if (!values.email || values.email.trim() === '') {
    errors.email = 'Vui lòng nhập email';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Email không hợp lệ';
  }

  // Validate password
  if (!values.password || values.password.trim() === '') {
    errors.password = 'Vui lòng nhập mật khẩu';
  } else if (values.password.length < 6) {
    errors.password = 'Mật khẩu phải từ 6 ký tự trở lên';
  }

  return errors;
}

export function validateSignup(values) {
  const errors = validateLogin(values); 

  // Validate username
  if (!values.name || values.name.trim() === '') {
    errors.name = 'Vui lòng nhập tên người dùng';
  }

  // Validate confirm password
  if (!values.conf_password || values.conf_password.trim() === '') {
    errors.conf_password = 'Vui lòng nhập lại mật khẩu';
  } else if (values.password !== values.conf_password) {
    errors.conf_password = 'Mật khẩu xác nhận không khớp';
  }

  return errors;
}
