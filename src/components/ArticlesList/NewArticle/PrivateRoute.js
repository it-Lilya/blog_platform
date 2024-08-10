import React from 'react';
import { Navigate } from 'react-router-dom';
const PrivateRoute = ({ children }) => {
  return JSON.parse(localStorage.getItem('auth')) ? children : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
