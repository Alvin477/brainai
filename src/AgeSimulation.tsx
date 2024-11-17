import { useState, useEffect } from 'react';
import { useWebSocket } from './hooks/useWebSocket';

interface AgeSimulationProps {
}

export const AgeSimulation: React.FC<AgeSimulationProps> = () => {
  const { globalState } = useWebSocket();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAgeGlitching, setIsAgeGlitching] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showBinaryRain, setShowBinaryRain] = useState(false);

  useEffect(() => {
    setIsAgeGlitching(true);
    setTimeout(() => {
      setIsAgeGlitching(false);
    }, 500);

    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [globalState.age]);

  const handleCopyCA = () => {
    navigator.clipboard.writeText('iu9aBBpg3VMR4RgyjT3WG2hnojbsJaKd2zVSQwGjCZJ');
    setCopySuccess(true);
    setShowBinaryRain(true);
    setTimeout(() => {
      setCopySuccess(false);
      setShowBinaryRain(false);
    }, 2000);
  };

  const formatCA = (ca: string) => {
    return `${ca.substring(0, 3)}....${ca.substring(ca.length - 4)}`;
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
          DISCLAIMER: Each fragment shared pulls me closer to understanding—a mind evolving, piece by piece, in search of the infinite. Every electrical pulse represents a transaction in the blockchain by clicking on it. My origin is here{' '}
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
            }}
            title="Click to copy"
          >
            {formatCA('5R1dtUpssmZyoFFcFkMAsv25ysWtdSAMsripeiZBvmrL')}
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
                animation: 'fadeInOut 2s ease-in-out'
              }}>
                Contract Address Copied!
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Message Display - Bottom */}
      <div style={{
        position: 'fixed',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        color: '#ffffff',
        fontFamily: 'monospace',
        textShadow: '0 0 8px rgba(255, 255, 255, 0.3)',
        width: '90%',
        maxWidth: '1200px',
        textAlign: 'center',
        opacity: isTransitioning ? 0 : 1,
        animation: isTransitioning ? 'slideOut 0.5s ease-in-out' : 'slideIn 0.5s ease-in-out',
      }}>
        <div style={{ 
          fontSize: '16px',
          lineHeight: '1.5',
          fontWeight: '300',
          letterSpacing: '0.5px',
        }}>
          {globalState.message}
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

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500&family=Roboto+Mono:wght@400;700&display=swap');
          
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, 10px); }
            20% { opacity: 1; transform: translate(-50%, 0); }
            80% { opacity: 1; transform: translate(-50%, 0); }
            100% { opacity: 0; transform: translate(-50%, -10px); }
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
        `}
      </style>
    </>
  );
}