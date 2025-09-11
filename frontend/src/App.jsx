import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EditarCompartimento from "./pages/EditarCompartimento";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editar/:id" element={<EditarCompartimento />} />
        <Route path="/editar/nuevo/:compartimento" element={<EditarCompartimento />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
