import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { IMAGES } from '../../utils/imagePaths';

const Navigation: React.FC = () => {
  return (
    <Navbar bg="light" expand="lg" className="header">
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
        <Nav className="header-nav">
          <Nav.Link as={Link} to="/catalog_tco" className="nav-link">
            Каталог услуг TCO
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export { Navigation as Navbar };
