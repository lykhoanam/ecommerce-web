import React, { useContext } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import cartContext from '../../contexts/cart/cartContext';


const QuantityBox = (props) => {

    const { itemId, itemQuantity } = props;

    const { incrementItem, decrementItem } = useContext(cartContext);


    return (
        <>
            <div className="quantity_box" style={{border: '2px solid red',}}>
                <button
                    type="button"
                    onClick={() => decrementItem(itemId)}
                     style={{
                        backgroundColor: 'white',
                        color: 'red',
                        border: '2px solid red',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}            
                >
                    <FaMinus />
                </button>

                <span className="quantity_count">
                    {itemQuantity}
                </span>

                <button
                    type="button"
                    onClick={() => incrementItem(itemId)}
                    disabled={itemQuantity >= 5}
                     style={{
                        backgroundColor: 'white',
                        color: 'red',
                        border: '2px solid red',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    <FaPlus />
                </button>
            </div>
        </>
    );
};

export default QuantityBox;