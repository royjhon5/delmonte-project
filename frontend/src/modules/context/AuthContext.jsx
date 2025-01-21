import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from 'prop-types'; 
import http from '../../api/http';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [ accessToken, setAccessToken ] = useState(null);
  const [ updatePassMessage, setUpdatePassMessage ] = useState(null);
  const [ error, setError ] = useState('');
  const [ loadingBtn, setLoadingBtn ]  = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      const decoded = jwtDecode(storedToken);
      setAccessToken(decoded);
      setIsAuthenticated(true);
      checkTokenExpiration(decoded);
    }
  }, []);

  useEffect(() => { 
    let interval;
    if (accessToken) {
      interval = setInterval(() => {
        checkTokenExpiration(accessToken);
      }, 1000); 
    }
    return () => clearInterval(interval);
  }, [accessToken]);

  const checkTokenExpiration = (token) => {
    const currentTime = Date.now() / 1000;
    if (token.exp < currentTime) {
      tokenexpirationLogout(); 
    }
  };

  const login = async (username, password) => {
    setLoadingBtn(true);
    try {
      const response = await http.post('/login', { username, password });
      const decoded = jwtDecode(response.data.accessToken);
      localStorage.setItem('accessToken', response.data.accessToken);
      setAccessToken(decoded);
      setIsAuthenticated(true);
      
      checkTokenExpiration(decoded);
      setLoadingBtn(false);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        if (error.response.data.error === "Invalid username or password.") {
            setError("Invalid username or password.");
            setLoadingBtn(false);
        } else if (error.response.data.error === "Password incorrect") {
            setError("Password incorrect");
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

  const passwordChanged = async () => {
    try {
      const response = await http.delete('/logout');
      if (response.status === 200) {
        localStorage.removeItem('accessToken');
        setAccessToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setError("Password has been changed.");
      } else {
        setError("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      setError("An error occurred during logout. Please try again.");
    }
  };

  const userUpdatePassword = async (OTP, password) => {
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

  const value = {
    isAuthenticated,
    user,
    accessToken,
    login,
    logout,
    idleLogout,
    userUpdatePassword,
    updatePassMessage,
    error,
    loadingBtn,
    passwordChanged
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

export const useAuth = () => {
  return useContext(AuthContext)
}
