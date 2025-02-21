import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { BoxArrowRight } from 'react-bootstrap-icons';
import './MiniLayout.css'; // Create this file for custom styles

const useHideOnScroll = () => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
      setShow(false);
    } else {
      setShow(true);
    }

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return show;
};

const MiniLayout = ({ children }) => {
  const { userRole, name, logout } = useAuth();
  const navigate = useNavigate();
  const show = useHideOnScroll();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className={`fixed-top ${show ? 'show' : 'hide'}`} id="navbar">
        <nav className="navbar navbar-dark bg-dark">
          <div className="container-fluid d-flex justify-content-between align-items-center">
            <span
              className="navbar-brand mb-0 h1 text-center mx-auto"
              onClick={() => navigate('/')}
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1.8rem',
                cursor: 'pointer',
              }}
            >
              MentorConnect
            </span>
            <div className="d-flex align-items-center ml-auto">
              <span
                className="navbar-text"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '1.2rem',
                  color: 'white',
                  textAlign: 'right',
                }}
              >
                Welcome, {name}
                <span
                  style={{
                    marginLeft: '0.5rem',
                    fontSize: '0.8rem',
                    color: 'white',
                  }}
                >
                  ({userRole})
                </span>
              </span>
              <button className="btn btn-outline-light ml-2" onClick={handleLogout}>
                <BoxArrowRight size={24} />
              </button>
            </div>
          </div>
        </nav>
      </div>

      <main className="flex-grow-1 mt-5 pt-4 container-fluid">
        {children}
      </main>

      <footer className="bg-dark py-3 text-white mt-auto text-center">
        <small>
          &copy; {new Date().getFullYear()} MentorConnect. All rights reserved.
        </small>
      </footer>
    </div>
  );
};

export default MiniLayout;
