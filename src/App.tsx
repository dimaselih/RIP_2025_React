import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Provider } from 'react-redux';
import { store } from './store';
import { Navbar, Breadcrumbs } from './components/layout';
import { HomePage, ServicesPage, ServiceDetailPage } from './pages';
import { invoke } from '@tauri-apps/api/core';
import { dest_root } from './config/target_config';

function App() {
  useEffect(() => {
    invoke('tauri', { cmd: 'create' })
      .then(() => {})
      .catch(() => {});

    return () => {
      invoke('tauri', { cmd: 'close' })
        .then(() => {})
        .catch(() => {});
    };
  }, []);

  return (
    <Provider store={store}>
    <BrowserRouter basename={dest_root}>
      <Navbar />
      <main className="main-content">
        <Container fluid className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog_tco" element={<ServicesPage />} />
            <Route path="/catalog_tco/:id" element={<ServiceDetailPage />} />
          </Routes>
        </Container>
      </main>
    </BrowserRouter>
    </Provider>
  );
}

export default App;
