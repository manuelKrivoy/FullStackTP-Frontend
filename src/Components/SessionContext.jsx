import { createContext, useState, useContext } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signIn = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:3001/api/auth", { username, password });
      setUser(username);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  };

  const signOut = () => {
    setUser(null);
  };

  return <SessionContext.Provider value={{ user, signIn, signOut }}>{children}</SessionContext.Provider>;
};
