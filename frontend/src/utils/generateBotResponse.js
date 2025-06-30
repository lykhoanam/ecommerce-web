import { getProducts } from '../api/productApi';

/**
 * Gửi yêu cầu đến server MCP để xử lý văn bản người dùng và trả về phản hồi phù hợp
 * @param {string} userText - văn bản người dùng nhập vào
 * @returns {Promise<{type: 'text'|'products', data: any}>}
 */

export const generateBotResponse = async (userText) => {
  try {
    const products = await getProducts();

    const res = await fetch('http://localhost:8000/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userText,
        products: products, // truyền danh sách sản phẩm
      }),
    });

    if (!res.ok) {
      throw new Error(`MCP request failed: ${res.status}`);
    }

    const data = await res.json();
    return data; // { type: 'text'|'products', data: ... }

  } catch (error) {
    console.error('MCP fetch error:', error);
    return {
      type: 'text',
      data: 'Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.',
    };
  }
};
