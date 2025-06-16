import React, { useState } from 'react';

const DeleteConfirmationModal = ({ data, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = () => {
        onDelete();
        setIsOpen(false);
    };

    const modalStyles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        },
        modal: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '400px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
        title: {
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '15px',
            color: '#333'
        },
        description: {
            marginBottom: '20px',
            color: '#666'
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px'
        },
        deleteButton: {
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
        },
        cancelButton: {
            backgroundColor: '#f3f4f6',
            color: '#333',
            border: '1px solid #d1d5db',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                type="button"
                className="block rounded px-2 text-xs font-medium uppercase leading-normal text-red-500 hover:text-red-600 w-auto"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 26 26"><path fill="currentColor" d="M11.5-.031c-1.958 0-3.531 1.627-3.531 3.594V4H4c-.551 0-1 .449-1 1v1H2v2h2v15c0 1.645 1.355 3 3 3h12c1.645 0 3-1.355 3-3V8h2V6h-1V5c0-.551-.449-1-1-1h-3.969v-.438c0-1.966-1.573-3.593-3.531-3.593h-3zm0 2.062h3c.804 0 1.469.656 1.469 1.531V4H10.03v-.438c0-.875.665-1.53 1.469-1.53zM6 8h5.125c.124.013.247.031.375.031h3c.128 0 .25-.018.375-.031H20v15c0 .563-.437 1-1 1H7c-.563 0-1-.437-1-1V8zm2 2v12h2V10H8zm4 0v12h2V10h-2zm4 0v12h2V10h-2z"/></svg>
            </button>

            {isOpen && (
                <div style={modalStyles.overlay}>
                    <div style={modalStyles.modal}>
                        <div style={modalStyles.title}>Xác nhận xóa</div>
                        <div style={modalStyles.description}>
                            {data}
                        </div>
                        <div style={modalStyles.buttonContainer}>
                            <button
                                onClick={() => setIsOpen(false)}
                                style={modalStyles.cancelButton}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleDelete}
                                style={modalStyles.deleteButton}
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteConfirmationModal;