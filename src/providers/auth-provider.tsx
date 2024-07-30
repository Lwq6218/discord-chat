import axios from '@/services/axios-request';
import { ReactNode, createContext, useContext, useState } from 'react';

interface AuthContextType {
  uid: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  signIn: (name: string, password: string) => Promise<void>;
  signUp: (
    name: string,
    password: string,
    verifyCode: string,
    sesssionId: string
  ) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState({
    uid: localStorage.getItem('uid'),
    accessToken: localStorage.getItem('accessToken'),
    isAuthenticated:
      localStorage.getItem('accessToken') !== 'undefined' &&
      localStorage.getItem('accessToken') !== 'null' &&
      localStorage.getItem('accessToken') !== null &&
      localStorage.getItem('accessToken') !== undefined,
  });

  const signIn = async (name: string, password: string) => {
    try {
      const response = await axios.post('/user/sign-in', {
        name,
        password,
      });

      console.log('登录成功:', response.data);
      const { token: accessToken, uid } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('uid', uid);
      setAuthState({
        accessToken,
        isAuthenticated: true,
        uid,
      });
    } catch (error) {
      console.error('登录失败:', error);
      setAuthState({ accessToken: null, isAuthenticated: false, uid: null });
    }
  };

  const signUp = async (
    name: string,
    password: string,
    verifyCode: string,
    sessionId: string
  ) => {
    try {
      const response = await axios.post('/user/sign-up', {
        name,
        password,
        sessionId,
        verifyCode,
      });

      console.log('注册成功:', response.data);
      const { token: accessToken, uid } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('uid', uid);
      setAuthState({
        accessToken,
        isAuthenticated: true,
        uid,
      });
    } catch (error) {
      console.error('注册失败:', error);
      setAuthState({ accessToken: null, isAuthenticated: false, uid: null });
    }
  };
  const signOut = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('uid');
    setAuthState({ accessToken: null, isAuthenticated: false, uid: null });
    window.location.href = '/user/sign-in';
  };

  return (
    <AuthContext.Provider value={{ ...authState, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
