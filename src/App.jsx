import './App.css';
import { Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import NotFound from './components/NotFound';
import Dashboard from './components/Dashboard';
import Pedido from './components/Pedido';
import Contacto from './components/Contacto';
import QuotationForm from './components/QuotationForm';

function App() {
  
  return (
    <>
    <Menu></Menu>
    <Routes>
        <Route path='/' element={<QuotationForm />} />
        <Route path='/QuotationForm' element={<QuotationForm />} />
        <Route path='/Pedido' element={<Pedido />} />
        <Route path='/Dashboard' element={<Dashboard />} />
        <Route path='/Contacto' element={<Contacto />} />
        <Route path="*" element={<NotFound />} />        
    </Routes>
    </>
  )
}

export default App
