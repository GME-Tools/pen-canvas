import { Button } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';

import { useFirebase } from "context/FirebaseContext";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const firebase = useFirebase();
  const navigate = useNavigate();

  const handleSubmit = event => {
    firebase.doSignIn()
        .then(() => {
          navigate('/list');
        })
        .catch(err => {});
    event.preventDefault();
  }

  return (
    <div className="container">
      <div className="main">
        <form className="button" onSubmit={handleSubmit}>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            startIcon={<GoogleIcon />}
            sx={{backgroundColor: "white", color: "#333333"}}
          >
            Authentification avec Google
          </Button>
        </form>
      </div>
    </div>
  )
}
