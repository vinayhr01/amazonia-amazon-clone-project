import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Store } from '../Store';

export default function ProtectedRoute({ children }) {
    const { state } = useContext(Store);
    const { UserInfo } = state;
    return UserInfo ? children : <Navigate to="/signin" />;
}