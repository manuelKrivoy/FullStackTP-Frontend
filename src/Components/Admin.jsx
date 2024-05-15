import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from "@mui/icons-material";

const Admin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [openAgregarDialog, setOpenAgregarDialog] = useState(false);
  const [openEditarDialog, setOpenEditarDialog] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({ username: "", password: "" });
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/users");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  const handleEliminarUsuario = async (username) => {
    try {
      await axios.delete(`http://localhost:3001/api/users/${username}`);
      obtenerUsuarios();
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const handleAbrirDialogAgregar = () => {
    setOpenAgregarDialog(true);
  };

  const handleCerrarDialogAgregar = () => {
    setOpenAgregarDialog(false);
  };

  const handleAbrirDialogEditar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setOpenEditarDialog(true);
  };

  const handleCerrarDialogEditar = () => {
    setUsuarioSeleccionado(null);
    setOpenEditarDialog(false);
  };

  const handleGuardarUsuario = async () => {
    try {
      await axios.post("http://localhost:3001/api/users", nuevoUsuario);
      handleCerrarDialogAgregar();
      obtenerUsuarios();
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    }
  };

  const handleGuardarEdicionUsuario = async () => {
    try {
      await axios.patch(`http://localhost:3001/api/users/${usuarioSeleccionado.username}`, {
        password: usuarioSeleccionado.password,
      });
      handleCerrarDialogEditar();
      obtenerUsuarios();
    } catch (error) {
      console.error("Error al editar el usuario:", error);
    }
  };

  return (
    <div>
      <h2>Panel Administrador</h2>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAbrirDialogAgregar}
        sx={{ float: "right", mb: 2 }}
      >
        Agregar Usuario
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Contraseña</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario, index) => (
              <TableRow key={index}>
                <TableCell>{usuario.username}</TableCell>
                <TableCell>{usuario.password}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="editar"
                    disabled={usuario.username === "admin"}
                    onClick={() => handleAbrirDialogEditar(usuario)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="eliminar"
                    disabled={usuario.username === "admin"}
                    onClick={() => handleEliminarUsuario(usuario.username)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openAgregarDialog} onClose={handleCerrarDialogAgregar}>
        <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            name="username"
            label="Usuario"
            type="text"
            fullWidth
            value={nuevoUsuario.username}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, username: e.target.value })}
          />
          <TextField
            margin="dense"
            id="password"
            name="password"
            label="Contraseña"
            type="password"
            fullWidth
            value={nuevoUsuario.password}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCerrarDialogAgregar}>Cancelar</Button>
          <Button onClick={handleGuardarUsuario} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditarDialog} onClose={handleCerrarDialogEditar}>
        <DialogTitle>Cambiar Contraseña</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="password"
            name="password"
            label="Nueva Contraseña"
            fullWidth
            value={usuarioSeleccionado ? usuarioSeleccionado.password : ""}
            onChange={(e) => setUsuarioSeleccionado({ ...usuarioSeleccionado, password: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCerrarDialogEditar}>Cancelar</Button>
          <Button onClick={handleGuardarEdicionUsuario} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Admin;
