/* eslint-disable */

import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import PropTypes from 'prop-types';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import http from "@/api/http";

// Define types for AuthContext and its state
interface AuthContextType {
  isAuthenticated: boolean;
  user: any; // Define the user type based on your data structure
  accessToken: JwtPayload | null;
  login: (username: string, password: string) => void;
  logout: () => void;
  idleLogout: () => void;
  userUpdatePassword: (OTP: string, password: string) => void;
  updatePassMessage: string | null;
  error: string;
  loadingBtn: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState(null); // Define more specific user type if available
  const [accessToken, setAccessToken] = useState<JwtPayload | null>(null);
  const [updatePassMessage, setUpdatePassMessage] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      const decoded = jwtDecode<JwtPayload>(storedToken);
      setAccessToken(decoded);
      setIsAuthenticated(true);
      checkTokenExpiration(decoded);
    }
  }, []);

  useEffect(() => { 
    let interval: NodeJS.Timeout;
    if (accessToken) {
      interval = setInterval(() => {
        checkTokenExpiration(accessToken);
      }, 1000); 
    }
    return () => clearInterval(interval);
  }, [accessToken]);

  const checkTokenExpiration = (token: JwtPayload) => {
    const currentTime = Date.now() / 1000;
    if (token.exp && token.exp < currentTime) {
      tokenexpirationLogout(); 
    }
  };

  const login = async (username: string, password: string) => {
    setLoadingBtn(true);
    try {
      const response = await http.post('/login', { username, password });
      const decoded = jwtDecode<JwtPayload>(response.data.accessToken);
      localStorage.setItem('accessToken', response.data.accessToken);
      setAccessToken(decoded);
      setIsAuthenticated(true);
      
      checkTokenExpiration(decoded);
      setLoadingBtn(false);
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        if (error.response.data.error === "Invalid username or password") {
          setError("Invalid username or password.");
          setLoadingBtn(false);
        } else if (error.response.data.error === "Password incorrect") {
          setError("Password incorrect");
          setLoadingBtn(false);
        } else if (error.response.data.error === "User is already logged in on another device.") {
          setError("User is already logged in on another device.");
          setLoadingBtn(false);
        }
      } else {
        setError("Server Error");
        setLoadingBtn(false);
      }
    }
  };

  const logout = async () => {
    try {
      const response = await http.delete('/logout');
      if (response.status === 200) {
        localStorage.removeItem('accessToken');
        setAccessToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setError("Logout successful");
      } else {
        setError("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      setError("An error occurred during logout. Please try again.");
    }
  };

  const userUpdatePassword = async (OTP: string, password: string) => {
    await http.get(`/update-password?OTP=${OTP}&newPassword=${password}`);
    setUpdatePassMessage('Password updated, please login your new password.');
  }

  const tokenexpirationLogout = async () => {
    await http.delete('/logout');
    localStorage.removeItem('accessToken');
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError("Session expired. For security, inactive accounts auto-logout after 1 day. Please log in again. Thank you.");
  }

  const idleLogout = async () => {
    await http.delete('/logout');
    localStorage.removeItem('accessToken');
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError("Your session has expired due to 15 minutes of inactivity; you have been automatically logged out.");
  }

  const value: AuthContextType = {
    isAuthenticated,
    user,
    accessToken,
    login,
    logout,
    idleLogout,
    userUpdatePassword,
    updatePassMessage,
    error,
    loadingBtn
  };
    
  return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
