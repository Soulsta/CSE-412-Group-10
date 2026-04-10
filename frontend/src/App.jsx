import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './loginPage';
import HomePage from './HomePage';
import AdminHomePage from './AdminHomePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/admin/home" element={<AdminHomePage />} />
      </Routes>
    </BrowserRouter>
  );
}