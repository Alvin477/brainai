import { useState, useEffect } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import { Link, useNavigate } from 'react-router-dom';

interface AgeSimulationProps {
}

export const AgeSimulation: React.FC<AgeSimulationProps> = () => {
  const { globalState } = useWebSocket();
  const [isAgeGlitching, setIsAgeGlitching] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showBinaryRain, setShowBinaryRain] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAgeGlitching(true);
    setTimeout(() => {
      setIsAgeGlitching(false);
    }, 500);
  }, [globalState.age]);

  const handleCopyCA = () => {
    navigator.clipboard.writeText('4srdYpV6kirA6u32nSXVFgfokSmtwMdb49gxqHbUpump');
    setCopySuccess(true);
    setShowBinaryRain(true);
    setTimeout(() => {
      setCopySuccess(false);
      setShowBinaryRain(false);
    }, 2000);
  };

  return (
    <>
      {/* Age Display - Top */}
      <div style={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{ 
          fontSize: '24px',
          textAlign: 'center',
          letterSpacing: '1px',
          fontWeight: 'bold',
          color: '#4099ff',
          textShadow: '0 0 8px rgba(64, 153, 255, 0.5)',
          animation: isAgeGlitching ? 'glitch 0.5s ease-in-out' : 'none',
          fontFamily: '"Orbitron", monospace'
        }}>
          Brain Age: {globalState.age}
        </div>
        
        <div style={{
          color: '#ffffff',
          fontFamily: '"Roboto Mono", monospace',
          fontSize: '12px',
          textAlign: 'center',
          maxWidth: '600px',
          textShadow: '0 0 8px rgba(255, 255, 255, 0.3)',
          opacity: 0.8,
          letterSpacing: '0.5px',
          lineHeight: '1.4'
        }}>
DISCLAIMER: Each electric pulse in my brain represents a transaction made through the blockchain and each transaction triggers further development of my brain augmenting my learning capacity and my comprehension of life itself. Click them to find their origin.        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginTop: '5px'
        }}>
          <span style={{
            color: '#4099ff',
            fontFamily: '"Orbitron", monospace',
            fontSize: '16px',
          }}>
            CA:
          </span>
          <span 
            onClick={handleCopyCA}
            className="contract-address"
            style={{
              color: '#4099ff',
              cursor: 'pointer',
              textDecoration: 'underline',
              position: 'relative',
              fontWeight: 'bold',
              padding: '2px 6px',
              borderRadius: '4px',
              transition: 'all 0.3s ease',
              background: 'rgba(64, 153, 255, 0.1)',
              fontSize: '18px',
              letterSpacing: '0.5px'
            }}
            title="Click to copy"
          >
            4srdYpV6kirA6u32nSXVFgfokSmtwMdb49gxqHbUpump
            {copySuccess && (
              <span style={{
                position: 'absolute',
                top: '-30px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(64, 153, 255, 0.9)',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                color: 'white',
                boxShadow: '0 0 15px rgba(64, 153, 255, 0.3)',
                animation: 'fadeInOut 2s ease-in-out',
                whiteSpace: 'nowrap'
              }}>
                Contract Address Copied!
              </span>
            )}
          </span>
        </div>

        <div style={{ marginTop: '5px' }}>
          <Link to="/diary" style={{
            color: '#4099ff',
            textDecoration: 'none',
            fontWeight: 'bold',
            padding: '2px 6px',
            borderRadius: '4px',
            background: 'rgba(64, 153, 255, 0.1)',
            transition: 'all 0.3s ease'
          }}>
            My Diary
          </Link>
        </div>
      </div>

      {showBinaryRain && (
        <div className="binary-rain">
          {Array(20).fill(0).map((_, i) => (
            <div key={i} className="binary" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 0.5}s` }}>
              {Math.random().toString(2).substring(2, 10)}
            </div>
          ))}
        </div>
      )}

      {/* Message Display - Bottom */}
      <div 
        className="message-container"
        onClick={() => navigate('/diary')}
        style={{
          position: 'fixed',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: '"Roboto Mono", monospace',
          lineHeight: '1.6',
          fontSize: '16px',
          color: '#ffffff',
          opacity: globalState.message && globalState.message !== "Initializing..." ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
          animation: 'slideUpFade 0.5s ease-in-out',
          padding: '20px',
          maxWidth: '95%',
          textAlign: 'center',
          zIndex: 1000,
        }}>
        {globalState.message && globalState.message !== "Initializing..." && (
          <div style={{
            animation: 'messageFade 4s ease-in-out',
            position: 'relative'
          }}>
            {globalState.message}
          </div>
        )}
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500&family=Roboto+Mono:wght@400;700&display=swap');
          
          @keyframes fadeInOut {
            0% { opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { opacity: 0; }
          }
          
          @keyframes pulse {
            0% { box-shadow: 0 0 15px rgba(64, 153, 255, 0.2), 0 0 30px rgba(64, 153, 255, 0.1), inset 0 0 10px rgba(64, 153, 255, 0.1); }
            50% { box-shadow: 0 0 20px rgba(64, 153, 255, 0.3), 0 0 40px rgba(64, 153, 255, 0.2), inset 0 0 15px rgba(64, 153, 255, 0.2); }
            100% { box-shadow: 0 0 15px rgba(64, 153, 255, 0.2), 0 0 30px rgba(64, 153, 255, 0.1), inset 0 0 10px rgba(64, 153, 255, 0.1); }
          }
          @keyframes slideIn {
            from { 
              opacity: 0; 
              transform: translate(-50%, 100%);
            }
            to { 
              opacity: 1; 
              transform: translate(-50%, 0);
            }
          }
          @keyframes slideOut {
            from { 
              opacity: 1; 
              transform: translate(-50%, 0);
            }
            to { 
              opacity: 0; 
              transform: translate(-50%, 100%);
            }
          }
          @keyframes glitch {
            0% {
              transform: translate(0);
              text-shadow: 0 0 8px rgba(64, 153, 255, 0.5);
            }
            20% {
              transform: translate(-2px, 2px);
              text-shadow: 2px 0 #ff0080, -2px 0 #0040ff;
            }
            40% {
              transform: translate(-2px, -2px);
              text-shadow: 4px 0 #ff0080, -4px 0 #0040ff;
            }
            60% {
              transform: translate(2px, 2px);
              text-shadow: 2px 0 #ff0080, -2px 0 #0040ff;
            }
            80% {
              transform: translate(2px, -2px);
              text-shadow: 0 0 8px rgba(64, 153, 255, 0.5);
            }
            100% {
              transform: translate(0);
              text-shadow: 0 0 8px rgba(64, 153, 255, 0.5);
            }
          }
          .contract-address:hover {
            background: rgba(64, 153, 255, 0.2);
          }
          .binary-rain {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1001;
          }
          .binary {
            position: absolute;
            color: #4099ff;
            font-family: 'Roboto Mono', monospace;
            font-size: 14px;
            opacity: 0;
            animation: binaryDrop 1.5s linear forwards;
          }
          @keyframes binaryDrop {
            0% {
              transform: translateY(-100px);
              opacity: 1;
            }
            80% {
              opacity: 0.5;
            }
            100% {
              transform: translateY(100vh);
              opacity: 0;
            }
          }
          .message-container {
            pointer-events: auto;
            cursor: pointer;
          }
          .message-container:hover {
            color: #4099ff;
          }
          @keyframes slideUpFade {
            0% {
              opacity: 0;
              transform: translate(-50%, 20px);
            }
            100% {
              opacity: 1;
              transform: translate(-50%, 0);
            }
          }
          @keyframes messageFade {
            0% {
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          }
        `}
      </style>
    </>
  );
}