// usuarios.js
export const usuarios = [
  { user: "admin", password: "admin" },
  { user: "user", password: "user" },
  // Agrega más usuarios según sea necesario
];

export const verificarUsuario = (user, password) => {
  console.log(user, password);
  return usuarios.some((usuario) => usuario.user === user && usuario.password === password);
};
