import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./Components/SignIn";
import Panel from "./Components/Panel"; // Importa el componente Panel
import Admin from "./Components/Admin";
import { SessionProvider } from "./Components/SessionContext";

function App() {
  return (
    <SessionProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/panel" element={<Panel />} />
          <Route path="/admin" element={<Admin />} />
          {/* Otras rutas según sea necesario */}
        </Routes>
      </Router>
    </SessionProvider>
  );
}

export default App;
