import React, { useEffect, useState } from "react";
import { useSession } from "./SessionContext";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

function Panel() {
  const { user, signOut } = useSession();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [openEditarDialog, setOpenEditarDialog] = useState(false);
  const [mensajeSeleccionado, setmensajeSeleccionado] = useState(null);

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
      await axios.post(`http://localhost:3001/api/messages/${user}`, { text: mensaje }); // Corregido
      obtenerMensajes();
      setMensaje("");
    } catch (error) {
      console.error("Error al publicar el mensaje:", error);
    }
  };

  const handleEliminarMensaje = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/messages/${id}`);
      obtenerMensajes();
    } catch (error) {
      console.error("Error al eliminar el mensaje:", error);
    }
  };

  const handleAbrirDialogEditar = (mensaje) => {
    setmensajeSeleccionado(mensaje);
    setOpenEditarDialog(true);
  };

  const handleCerrarDialogEditar = () => {
    setmensajeSeleccionado(null);
    setOpenEditarDialog(false);
  };

  const handleGuardarEdicionMensaje = async () => {
    try {
      await axios.patch(`http://localhost:3001/api/messages/${mensajeSeleccionado.id}`, {
        text: mensajeSeleccionado.text,
      });
      handleCerrarDialogEditar();
      obtenerMensajes();
    } catch (error) {
      console.error("Error al editar el usuario:", error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Bienvenido: {user}
      </Typography>
      <Button
        style={{ marginBottom: 10 }}
        variant="contained"
        color="error"
        onClick={signOut}
        startIcon={<ExitToAppIcon />}
      >
        Cerrar sesión
      </Button>
      <TextField
        label="Escribe una nota"
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

      <div>
        <Typography variant="h6">Notas:</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Descripcion</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mensajes.map((mensaje) => (
                <TableRow key={mensaje.id}>
                  <TableCell>{mensaje.text}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEliminarMensaje(mensaje.id)}>
                      <DeleteIcon />
                    </Button>
                    <Button onClick={() => handleAbrirDialogEditar(mensaje)}>
                      <EditIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog open={openEditarDialog} onClose={handleCerrarDialogEditar}>
        <DialogTitle>Editar Mensaje</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="text"
            name="text"
            label="Nuevo Mensaje"
            fullWidth
            value={mensajeSeleccionado ? mensajeSeleccionado.text : ""}
            onChange={(e) => setmensajeSeleccionado({ ...mensajeSeleccionado, text: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCerrarDialogEditar}>Cancelar</Button>
          <Button
            onClick={handleGuardarEdicionMensaje}
            variant="contained"
            color="primary"
            disabled={!mensajeSeleccionado || mensajeSeleccionado.text.trim() === ""}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Panel;
