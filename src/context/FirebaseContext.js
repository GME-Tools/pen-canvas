import { createContext, useContext } from 'react';
import Firebase from 'config/firebase';

const FirebaseContext = createContext();

export function FirebaseProvider({ children }) {
  const firebase = new Firebase();
  return <FirebaseContext.Provider value={firebase}>{children}</FirebaseContext.Provider>;
}
export const useFirebase = () => useContext(FirebaseContext);