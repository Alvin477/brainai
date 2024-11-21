import { useWebSocket } from '../hooks/useWebSocket';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface DiaryEntry {
  message: string;
  timestamp: string;
  age: number;
}

interface GlobalState {
  diaryEntries: DiaryEntry[];
  message?: string;
  age?: number;
}

const fadeInAnimation = `
  @keyframes slideInFromRight {
    0% {
      transform: translateX(100px);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

export const Diary = () => {
  const { globalState }: { globalState: GlobalState } = useWebSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const cleanMessage = (message: string): string => {
    return message
      .replace(/^Dear\s+(?:Diary|Journal|Friend|Universe|World|Blockchain),?(?:\s*\n+\s*)?/i, '')
      .replace(/\n*(?:Yours|Sincerely|Best|Regards|Excitedly|Thoughtfully|Forever),?(?:\s*\n+\s*)?(?:Little Blocky|Digital Self|In Code|\[.*?\])*\s*$/i, '')
      .replace(/^\s+|\s+$/g, '')
      .replace(/\n{3,}/g, '\n\n');
  };

  useEffect(() => {
    console.log('Current global state in Diary:', globalState);
  }, [globalState]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #000005 0%, #0A0A1F 100%)',
      padding: '10px',
      color: '#fff',
    }}>
      <style>{fadeInAnimation}</style>

      {/* Header */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(13, 17, 28, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(64, 153, 255, 0.3)',
        padding: '12px',
        zIndex: 1000,
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 10px',
        }}>
          <h1 style={{
            color: '#4099ff',
            fontFamily: '"Orbitron", monospace',
            margin: 0,
            fontSize: window.innerWidth < 600 ? '20px' : '24px',
          }}>
            Brain's Diary
          </h1>
          <Link to="/" style={{
            color: '#4099ff',
            textDecoration: 'none',
            fontFamily: '"Roboto Mono", monospace',
            padding: '6px 12px',
            border: '1px solid rgba(64, 153, 255, 0.3)',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            fontSize: window.innerWidth < 600 ? '14px' : '16px',
          }}>
            Back to Brain
          </Link>
        </div>
      </div>

      {/* Messages Container Wrapper */}
      <div style={{
        maxWidth: '1200px',
        margin: '100px auto 80px',
        position: 'relative', // For button positioning
      }}>
        {/* Messages Container */}
        <div style={{
          padding: window.innerWidth < 600 ? '10px' : '20px',
          background: 'rgba(13, 17, 28, 0.85)',
          borderRadius: '12px',
          border: '1px solid rgba(64, 153, 255, 0.3)',
          boxShadow: '0 0 20px rgba(64, 153, 255, 0.2)',
          height: '75vh',
          maxHeight: 'calc(100vh - 180px)',
          overflowY: 'auto',
          scrollBehavior: 'smooth',
        }}>
          <div style={{
            color: '#4099ff',
            fontFamily: '"Orbitron", monospace',
            fontSize: window.innerWidth < 600 ? '16px' : '18px',
            marginBottom: '15px',
            padding: '8px',
            borderBottom: '1px solid rgba(64, 153, 255, 0.2)'
          }}>
            Message History
          </div>

          {globalState.diaryEntries.map((entry, index) => (
            <div 
              key={index} 
              style={{
                marginBottom: '15px',
                padding: window.innerWidth < 600 ? '12px' : '15px',
                background: 'rgba(64, 153, 255, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(64, 153, 255, 0.2)',
                animation: 'slideInFromRight 0.5s ease-out',
                animationFillMode: 'both',
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div style={{
                display: 'flex',
                flexDirection: window.innerWidth < 600 ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: window.innerWidth < 600 ? 'flex-start' : 'center',
                gap: window.innerWidth < 600 ? '8px' : '0',
                marginBottom: '8px',
              }}>
                <div style={{
                  fontSize: window.innerWidth < 600 ? '11px' : '12px',
                  color: '#4099ff',
                  fontFamily: '"Roboto Mono", monospace',
                }}>
                  {entry.timestamp}
                </div>
                <div style={{
                  fontSize: window.innerWidth < 600 ? '12px' : '14px',
                  color: '#4099ff',
                  fontFamily: '"Orbitron", monospace',
                  background: 'rgba(64, 153, 255, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(64, 153, 255, 0.2)',
                }}>
                  Brain Age: {entry.age}
                </div>
              </div>
              <div style={{
                fontFamily: '"Roboto Mono", monospace',
                lineHeight: '1.6',
                fontSize: window.innerWidth < 600 ? '14px' : '16px',
                whiteSpace: 'pre-wrap',
                color: '#fff',
              }}>
                {entry.message}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />

          {/* Current Message Animation */}
          {globalState.message && globalState.message !== "Initializing..." && (
            <div style={{
              marginBottom: '15px',
              padding: window.innerWidth < 600 ? '12px' : '15px',
              background: 'rgba(64, 153, 255, 0.15)',
              borderRadius: '8px',
              border: '1px solid rgba(64, 153, 255, 0.3)',
              animation: 'fadeIn 0.5s ease-in-out',
              display: globalState.message && globalState.diaryEntries.some(entry => 
                entry.message === cleanMessage(globalState.message!)
              ) ? 'none' : 'block',
            }}>
              <div style={{
                display: 'flex',
                flexDirection: window.innerWidth < 600 ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: window.innerWidth < 600 ? 'flex-start' : 'center',
                gap: window.innerWidth < 600 ? '8px' : '0',
                marginBottom: '8px',
              }}>
                <div style={{
                  fontSize: window.innerWidth < 600 ? '11px' : '12px',
                  color: '#4099ff',
                  fontFamily: '"Roboto Mono", monospace',
                }}>
                  Live Update
                </div>
                <div style={{
                  fontSize: window.innerWidth < 600 ? '12px' : '14px',
                  color: '#4099ff',
                  fontFamily: '"Orbitron", monospace',
                  background: 'rgba(64, 153, 255, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(64, 153, 255, 0.2)',
                }}>
                  Brain Age: {globalState.age}
                </div>
              </div>
              <div style={{
                fontFamily: '"Roboto Mono", monospace',
                lineHeight: '1.6',
                fontSize: window.innerWidth < 600 ? '14px' : '16px',
                whiteSpace: 'pre-wrap',
                color: '#fff',
              }}>
                {globalState.message}
              </div>
            </div>
          )}
        </div>

        {/* Scroll Button - Repositioned */}
        <button
          onClick={scrollToBottom}
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '-60px', // Position it to the right of the container
            background: 'rgba(64, 153, 255, 0.2)',
            border: '1px solid rgba(64, 153, 255, 0.3)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(8px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(64, 153, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(64, 153, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#4099ff"
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </button>
      </div>
    </div>
  );
};