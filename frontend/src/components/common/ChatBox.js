// ChatBox.jsx
import { useEffect, useState, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import { PiRobotDuotone } from 'react-icons/pi';
import { FiSend } from 'react-icons/fi';
import { generateBotResponse } from '../../utils/generateBotResponse';

const defaultOptions = [
  'Tìm nước hoa theo tên',
  'Tìm sản phẩm dưới 2 triệu',
  'Tư vấn mùi hương yêu thích',
  'Xem sản phẩm bán chạy',
];

const ChatBox = ({ onSendToAI }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showOptions, setShowOptions] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);


  const toggleChat = () => setIsOpen((prev) => !prev);

  const createMessage = (from, text) => ({
    from,
    text,
    timestamp: new Date().toISOString(),
  });

  const streamBotReply = (text, delayPerChar = 10) => {
    return new Promise((resolve) => {
      if (typeof text !== 'string') return resolve(); // chống lỗi

      let i = 0;
      setMessages((prev) => [...prev, createMessage('bot', '')]);

      const stream = () => {
        setMessages((prev) => {
          const updated = [...prev];
          const lastMsg = { ...updated[updated.length - 1] };
          lastMsg.text = text.slice(0, i);
          updated[updated.length - 1] = lastMsg;
          return updated;
        });

        i++;
        if (i <= text.length) {
          setTimeout(stream, delayPerChar);
        } else {
          resolve();
        }
      };

      stream();
    });
  };



  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMsg = createMessage('user', text);
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setShowOptions(false);

    // Loading effect
    const loadingMsg = createMessage('bot-loading', '');
    setMessages((prev) => [...prev, loadingMsg]);

    // Hiển thị dots trong 3s
    await new Promise(res => setTimeout(res, 3000));

    // Gọi AI agent
    // const response =
    //   (await onSendToAI?.(text)) ||
    //   "Các mùi nước hoa của C.K thường hướng đến hình ảnh trẻ trung, hiện đại, thể thao và luôn mang đậm cá tính. Như chính vẻ ngoài đen tuyền của mình, nổi bật với chữ shock for him mang đến những nốt hương cay nồng hoàn hảo. Mùi hương tươi mới và thanh mát của quả dưa leo ở lớp hương đầu là thứ vũ khí giúp chàng gây chú ý từ người khác, để rồi sau đó nhả ra chút cay nồng của tiêu, của quế và xạ hương, hổ phách ở nốt cuối chính là hình ảnh ấn tượng nam tính của một chàng trai trẻ trung và phong độ";

    const response = await generateBotResponse(text);
    if (response.type === 'text') {
      await streamBotReply(response.data);
    } else if (response.type === 'products') {
      // Stream câu nói trước
      if (response.message) {
        await streamBotReply(response.message);
      }

      // Sau đó hiển thị danh sách sản phẩm
      setMessages(prev => [
        ...prev,
        {
          from: 'bot',
          products: response.data,
          timestamp: new Date().toISOString(),
        },
      ]);
    }


    // Xóa loading và stream tin nhắn
    setMessages(prev => prev.filter(msg => msg.from !== 'bot-loading'));
    await streamBotReply(response);
  };





  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome = createMessage('bot', 'Bạn cần hỗ trợ gì?');
      setMessages([welcome]);
      setShowOptions(true);
    }
  }, [isOpen]);

  return (
    <div className="chatbox-container">
      {isOpen && (
        <div className="chatbox">
          <div className="chatbox-header">
            <img src="/logo.png" alt="Logo" className="chatbox-logo" />
            <span>AI Agent Assistant</span>
            <IoClose onClick={toggleChat} className="close-btn" />
          </div>

         <div className="chatbox-body">
  {messages.map((msg, idx) => (
    <div key={idx} className={`chat-msg-wrapper ${msg.from}`}>
      {msg.from === 'bot' && (
        <img src="/logo.png" alt="Logo" className="chatbox-logo" />
      )}

      <div className={`chat-msg ${msg.from}`}>
        {msg.products ? (
          <div className="product-grid">
            {msg.products.map((prod, i) => {
              const { title, images, variants } = prod;
              const price = variants[0].price;

              return (
                <div className="chat-product-card" key={i}>
                  <img src={images} alt={title} />
                  <div className="chat-product-info">
                    <strong title={title}>{title}</strong>
                    <p title={price.toLocaleString() + 'đ'}>{price.toLocaleString()}đ</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : msg.from === 'bot-loading' ? (
          <div className="loading-dots"><span /><span /><span /></div>
        ) : (
          <>
            <div className="msg-text">{msg.text}</div>
            <div className="timestamp">{formatTime(msg.timestamp)}</div>
          </>
        )}
      </div>

      {/* Nếu muốn thêm avatar user ở bên phải thì mở dòng dưới */}
      {/* {msg.from === 'user' && (
        <img src="/user-avatar.png" alt="User" className="chatbox-logo" />
      )} */}
    </div>
  ))}
  <div ref={bottomRef} />
</div>






          {/* Gợi ý lựa chọn */}
          {showOptions && (
            <div className="chatbox-options">
              {defaultOptions.map((opt, i) => (
                <button key={i} onClick={() => handleSend(opt)}>
                  {opt}
                </button>
              ))}
            </div>
          )}

          <div className="chatbox-footer">
            <textarea
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              rows={2}
            />
            <button onClick={() => handleSend(input)} title="Gửi" >
              <FiSend size={25} style={{ transform: 'rotate(45deg)' }}/>
            </button>

          </div>
        </div>
      )}

      {!isOpen && (
        <div className="chat-toggle-btn shake" onClick={toggleChat}>
          <PiRobotDuotone size={26} />
        </div>
      )}
    </div>
  );
};

export default ChatBox;
