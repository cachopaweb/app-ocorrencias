import React from 'react';

function CustomModal({ activate, setActivate, children, altura = 600, largura = 800, left = 0 }) {
    if (!activate) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setActivate(false)}>
            <div 
                className="bg-white border border-black rounded-lg shadow-xl p-4 relative" 
                style={{ width: largura || 600, height: altura || 600 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`text-black font-bold w-full h-full ${altura === '80vh' ? 'flex justify-center' : ''}`}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default CustomModal;