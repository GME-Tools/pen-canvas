import { useFirebase } from "context/FirebaseContext";
import { useEffect, useState } from "react";
import { Button, Card, Container, IconButton, Snackbar, Typography } from "@mui/material"
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';

export default function CanvasList() {
  const baseUrl = `${process.env.REACT_APP_HOSTING_URL}`;
  const firebase = useFirebase();
  const [canvas, setCanvas] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [newUuid, setNewUuid] = useState("");

  useEffect(() => {
    firebase.getCurrentUser().then(doc => {
      if (doc.data().hasOwnProperty('canvas')) {
        setCanvas(doc.data().canvas);
      }
      else {
        setCanvas([]);
      }
    })
    .catch(err => {
      firebase.setCurrentUserData({canvas: []})
    });
  }, [firebase]);

  useEffect(() => {
    if (newUuid !== "") {
      setOpen(true);
    }
  },[newUuid])

  const handleClose = () => setOpen(false);

  const handleNew = () => {
    const uid = uuidv4();
    const data = [...canvas, uid]
    setCanvas(data);
    firebase.setCurrentUserData({canvas: data});
    firebase.setDocument("canvas",uid,{});
    setNewUuid(uid);
  }

  const handleClickList = elem => {
    navigator.clipboard.writeText(baseUrl+"/"+elem+'/'+firebase.authUser().uid)
    setOpenSnack(true);
  }

  const handleDelete = elem => {
    const data = canvas.filter(canvas => canvas !== elem);
    setCanvas(data)
    firebase.setCurrentUserData({canvas: data});
    firebase.deleteDocument("canvas",elem);
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h5">Pen Canvas</Typography>
      <Button onClick={handleNew}>Nouveau</Button>
      <Card>
        <List>
        {
          canvas.map(elem => (
            <ListItem key={elem}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDelete(elem)}>
                  <DeleteIcon />
                </IconButton>
              }
              disablePadding
            >
              <ListItemButton onClick={() => handleClickList(elem)} dense>
                <ListItemText>{elem}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))
        }
        </List>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{"Nouveau Canvas"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="body1"><b>Edition :</b> {baseUrl}/{newUuid}/{firebase.authUser().uid}</Typography>
            <Typography variant="body1"><b>Lecture seule :</b> {baseUrl}/{newUuid}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>OK</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnack}
        autoHideDuration={5000}
        onClose={()=>setOpenSnack(false)}
        message="Lien copié"
      />
    </Container>
  )
}
