import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Provider, useDispatch } from 'react-redux';
import { store, AppDispatch } from './store';
import { Navbar } from './components/layout';
import { HomePage, ServicesPage, ServiceDetailPage, ProfilePage } from './pages';
import { LoginPage, RegisterPage } from './pages/authentication';
import { CalculationsPage, CalculationPage } from './pages/calculations';
import { dest_root } from './config/target_config';
import { logoutUser } from './store/thunks/authThunks';

function AppContent() {
  const dispatch = useDispatch<AppDispatch>();

  // При загрузке приложения сбрасываем серверную сессию, чтобы логин не переживал F5
  useEffect(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  return (
    <BrowserRouter basename={dest_root}>
      <Navbar />
      <main className="main-content">
        <Container fluid className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/calculations_tco" element={<CalculationsPage />} />
                  <Route path="/calculation_tco/:id" element={<CalculationPage />} />
            <Route path="/catalog_tco" element={<ServicesPage />} />
            <Route path="/catalog_tco/:id" element={<ServiceDetailPage />} />
          </Routes>
        </Container>
      </main>
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={store}>
        <AppContent />
    </Provider>
  );
}

export default App;
