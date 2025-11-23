import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { logoutUser } from '../../store/thunks/authThunks';
import { IMAGES } from '../../utils/imagePaths';
import '../../styles/navbar.css';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navbarExpanded, setNavbarExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Проверяем, что клик был вне dropdown и не на toggle кнопку
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(target) &&
        toggleRef.current &&
        !toggleRef.current.contains(target)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      // Добавляем обработчик с небольшой задержкой, чтобы не перехватить текущий клик
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <Navbar bg="light" expand="lg" className="header" expanded={navbarExpanded} onToggle={setNavbarExpanded}>
      <Container fluid className="header-content">
        <Navbar.Brand className="logo">
          <Link to="/">
            <img
              src={IMAGES.LOGO}
              alt="Logo"
              className="logo-img"
            />
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="header-nav ms-auto">
          <Nav.Link as={Link} to="/catalog_tco" className="nav-link">
            Каталог услуг TCO
          </Nav.Link>
            
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/calculations_tco" className="nav-link">
                  Мои заявки
                </Nav.Link>
                
                <div ref={dropdownRef} className="dropdown-wrapper">
                  <button
                    ref={toggleRef}
                    className="dropdown-toggle custom-dropdown-toggle"
                    onClick={toggleDropdown}
                    type="button"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                  >
                    {user?.email ? `👤 ${user.email.length > 20 ? user.email.substring(0, 20) + '...' : user.email}` : '👤 Профиль'}
                  </button>
                  {dropdownOpen && (
                    <div className="dropdown-menu custom-dropdown-menu">
                      <Link 
                        to="/profile" 
                        className="dropdown-item custom-dropdown-item"
                        onClick={closeDropdown}
                      >
                        🏠 Личный кабинет
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button
                        className="dropdown-item custom-dropdown-item"
                        onClick={() => {
                          closeDropdown();
                          handleLogout();
                        }}
                        type="button"
                      >
                        🚪 Выход
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {!isAuthenticated && (
              <Nav.Link as={Link} to="/login" className="nav-link login-btn">
                🔑 Вход
              </Nav.Link>
            )}
        </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export { Navigation as Navbar };
