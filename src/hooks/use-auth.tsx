
import { useContext } from 'react';
import { AuthProvider, useAuth as useAuthFromContext } from '@/contexts/AuthContext';

export const useAuth = useAuthFromContext;
