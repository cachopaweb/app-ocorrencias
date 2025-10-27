import React, { useState } from 'react';
import { MdClose, MdAttachFile, MdSend, MdSearch, MdMic } from 'react-icons/md';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PortalIA = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentTypingMessage, setCurrentTypingMessage] = useState(null);

  // Função para simular digitação gradual
  const typeMessage = async (fullMessage, messageId) => {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    let currentText = '';
    
    // Divide a mensagem em palavras
    const words = fullMessage.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i];
      setChatHistory(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, content: currentText }
            : msg
        )
      );
      // Atraso aleatório entre 50ms e 150ms por palavra
      await delay(Math.random() * 100 + 50);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch('https://n8n-portal.sytes.net/webhook/assistente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: message })
      });
      const data = await res.json();
      
      // Adiciona mensagem do usuário
      const messageId = Date.now();
      setChatHistory(prev => [...prev, 
        { type: 'user', content: message, id: messageId },
        { type: 'assistant', content: '', id: messageId + 1 }
      ]);
      setMessage('');
      
      // Inicia a digitação da resposta
      const response = data[0].output || JSON.stringify(data);
      typeMessage(response, messageId + 1);
    } catch (err) {
      const messageId = Date.now();
      setChatHistory(prev => [...prev, 
        { type: 'user', content: message, id: messageId },
        { type: 'assistant', content: '', id: messageId + 1 }
      ]);
      typeMessage("Desculpe, ocorreu um erro ao processar sua mensagem.", messageId + 1);
    }
    setLoading(false);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async function(evt) {
      const base64 = evt.target.result;
      try {
        const res = await fetch('https://n8n-portal.sytes.net/webhook/assistente', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imagem: base64 })
        });
        const data = await res.json();
        const messageId = Date.now();
        setChatHistory(prev => [...prev,
          { type: 'user', content: 'Imagem enviada', id: messageId },
          { type: 'assistant', content: '', id: messageId + 1 }
        ]);
        
        // Inicia a digitação da resposta
        const response = data[0].output || JSON.stringify(data);
        typeMessage(response, messageId + 1);
      } catch (err) {
        const messageId = Date.now();
        setChatHistory(prev => [...prev,
          { type: 'user', content: 'Imagem enviada', id: messageId },
          { type: 'assistant', content: '', id: messageId + 1 }
        ]);
        typeMessage("Desculpe, ocorreu um erro ao processar sua imagem.", messageId + 1);
      }
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 100,
      right: 30,
      width: 400,
      height: 600,
      backgroundColor: '#fff',
      borderRadius: 20,
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      zIndex: 1000
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0 }}>Bem vindo a PortaIA, Como posso ajudar?</h2>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 5
          }}
        >
          <MdClose size={24} />
        </button>
      </div>

      {/* Chat History */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              backgroundColor: msg.type === 'user' ? '#007AFF' : '#F2F2F2',
              color: msg.type === 'user' ? 'white' : 'black',
              padding: '10px 15px',
              borderRadius: 20,
              marginBottom: 10
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {msg.content}
            </ReactMarkdown>
          </div>
        ))}
        {loading && (
          <div style={{
            alignSelf: 'flex-start',
            backgroundColor: '#F2F2F2',
            padding: '10px 15px',
            borderRadius: 20
          }}>
            Digitando...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid #eee',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <input
          type="file"
          id="file-upload"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
          accept="image/*"
        />
        <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
          <MdAttachFile size={24} color="#666" />
        </label>

        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#F2F2F2',
          borderRadius: 25,
          padding: '8px 15px',
          gap: '10px'
        }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem"
            style={{
              flex: 1,
              border: 'none',
              background: 'none',
              outline: 'none',
              fontSize: 16
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={() => window.open('https://www.google.com', '_blank')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 5
            }}
          >
            <MdSearch size={20} color="#666" />
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 5
            }}
          >
            <MdMic size={20} color="#666" />
          </button>
        </div>

        <button
          onClick={handleSendMessage}
          disabled={loading || !message.trim()}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 5,
            opacity: loading || !message.trim() ? 0.5 : 1
          }}
        >
          <MdSend size={24} color="#007AFF" />
        </button>
      </div>
    </div>
  );
};

export default PortalIA;