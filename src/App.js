import { BrowserRouter as Router } from "react-router-dom";
import { Navigate, Route, Routes } from "react-router-dom";
import { CssBaseline } from "@mui/material";

import { useAuth } from "context/UserContext";

import SignIn from "components/SignIn/SignIn";
import CanvasList from "components/CanvasList/CanvasList";
import Canvas from './components/Canvas/Canvas';

import './App.css';


function SignInRoute() {
  const auth = useAuth();
  if (auth.authUser) {
    return <Navigate to="/list" replace />
  }
  return <SignIn />
}

function CanvasRoute() {
  let auth = useAuth();
  if (!auth.authUser) {
    return <Navigate to="/" replace />;
  }

  return <CanvasList />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignInRoute />} />
      <Route path="/list" element={<CanvasRoute />} />
      <Route path="/:id" element={<Canvas />} />
      <Route path="/:id/:token" element={<Canvas />} />
    </Routes>
  )
}

function App() {
  return (
    <div className="App">
      <Router>
      <div className="App">
        <CssBaseline />
        <AppRoutes />
      </div>
    </Router>
    </div>
  );
}

export default App;

