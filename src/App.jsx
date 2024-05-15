import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./Components/SignIn";
import Panel from "./Components/Panel"; // Importa el componente Panel
import Admin from "./Components/Admin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/panel" element={<Panel />} />
        <Route path="/admin" element={<Admin />} />
        {/* Otras rutas según sea necesario */}
      </Routes>
    </Router>
  );
}

export default App;
