// UserContext.js
import { createContext } from 'react';
import { useContext } from "react"; 

export const UserContext = createContext();
export const useUserContext = () => {
  return useContext(UserContext);
};
