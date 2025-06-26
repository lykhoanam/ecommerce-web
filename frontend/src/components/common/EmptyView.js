import React from 'react';
import { Link } from 'react-router-dom';

const EmptyView = (props) => {
  const { icon, msg, link, btnText } = props;

  return (
    <div
      className="empty_view_wrapper"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '1.5rem', // khoảng cách giữa các phần tử
        textAlign: 'center',
      }}
    >
      <div
        className="empty_view_icon"
        style={{ fontSize: '5rem', color: '#444' }}
      >
        {icon}
      </div>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{msg}</h2>
      {link && (
        <Link to={link} className="btn" style={{ padding: '0.5rem 1.5rem' }}>
          {btnText}
        </Link>
      )}
    </div>
  );
};

export default EmptyView;
