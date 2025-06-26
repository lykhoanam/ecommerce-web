const BASE_URL = 'http://localhost/api/users';

export const registerUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.msg || 'Đăng ký thất bại');
  }

  return await res.json(); // { token }
};

export const loginUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.msg || 'Đăng nhập thất bại');
  }

  return await res.json(); // { token, user }
};
