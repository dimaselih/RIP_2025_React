import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Provider } from 'react-redux';
import { store } from './store';
import { Navbar } from './components/layout';
import { HomePage, ServicesPage, ServiceDetailPage } from './pages';

function App() {
  return (
    <Provider store={store}>
    <BrowserRouter>
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
