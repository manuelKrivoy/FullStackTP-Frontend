import React, { useEffect, useState } from "react";
import { useSession } from "./SessionContext";
import { useNavigate } from "react-router-dom";
import { Button, Typography, TextField } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";

function Panel() {
  const { user, signOut } = useSession();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    if (!user || user === "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    obtenerMensajes();
  }, []);

  const obtenerMensajes = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/messages/${user}`);
      setMensajes(response.data);
    } catch (error) {
      console.error("Error al obtener los mensajes:", error);
    }
  };

  const handlePublicar = async () => {
    try {
      await axios.post(`http://localhost:3001/api/messages/${user}`, { mensaje });
      obtenerMensajes();
      setMensaje("");
    } catch (error) {
      console.error("Error al publicar el mensaje:", error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Bienvenido: {user}
      </Typography>
      <TextField
        label="Mensaje"
        variant="outlined"
        fullWidth
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handlePublicar}
        endIcon={<SendIcon />}
        disabled={!mensaje.trim()}
      >
        Publicar
      </Button>
      <Button variant="contained" color="error" onClick={signOut} startIcon={<ExitToAppIcon />}>
        Cerrar sesión
      </Button>
      <div>
        <Typography variant="h6">Mensajes:</Typography>
        {mensajes.map((mensaje, index) => (
          <Typography key={index} variant="body1">
            {mensaje.contenido}
          </Typography>
        ))}
      </div>
    </div>
  );
}

export default Panel;
