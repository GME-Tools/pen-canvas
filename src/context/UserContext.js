import { useState, useEffect } from 'react';
import { createContext, useContext } from 'react';
import { useFirebase } from 'context/FirebaseContext';

function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState(null);
  const firebase = useFirebase();

  const authStateChanged = async (authState) => {
    if (!authState) {
      setAuthUser(null);
      return;
    }
    setAuthUser(authState);
  };

  useEffect(() => {
    const unsubscribe = firebase.auth.onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
  }, 
[firebase.auth]);

  return {
    authUser
  };
}

const authUserContext = createContext({
  authUser: null
});

export function AuthUserProvider({ children }) {
  const auth = useFirebaseAuth();
  return <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>;
}
export const useAuth = () => useContext(authUserContext);
