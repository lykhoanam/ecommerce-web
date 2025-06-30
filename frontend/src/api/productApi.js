const PRODUCT_URL = 'http://localhost/api/products/get';

export const getProducts = async () => {
  const res = await fetch(PRODUCT_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.msg || 'Không thể lấy danh sách sản phẩm');
  }

  return await res.json(); 
};