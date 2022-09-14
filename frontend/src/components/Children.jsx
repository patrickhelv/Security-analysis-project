import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Child from "./Child";
import ChildrenService from "../services/children";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import EditChild from "./EditChild";
import Modal from "@mui/material/Modal";

const Children = ({ user }) => {
  const [children, setChildren] = useState(null);
  const [childFiles, setChildFiles] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fabStyle = {
    position: "absolute",
    bottom: 20,
    right: 20,
  };
  useEffect(() => {
    console.log("effect");
    ChildrenService.GetChildFileInfos().then((c) => setChildFiles(c));
    ChildrenService.GetChildren().then((c) => setChildren(c));
  }, []);

  return (
    <Container>
      <Typography sx={{ textAlign: "center" }} variant='h3'>
        Children
      </Typography>
      <Typography sx={{ textAlign: "center" }} variant='body'>
        Welcome to the Children page. Here you can add new child entries or edit
        existing ones. If you are Guardian for any children, you can also see
        the information for those children.
      </Typography>
      <Typography sx={{ textAlign: "center", mt: 1, mb: 1 }} variant='h4'>
        My Children
      </Typography>

      <Fab
        sx={fabStyle}
        variant='extended'
        color='secondary'
        aria-label='add'
        onClick={handleOpen}
      >
        <AddIcon sx={{ mr: 1 }} />
        Create new child entry
      </Fab>

      <Grid container spacing={1.5} justifyContent='center'>
        {children
          ?.filter((c) => c.parent === user.username)
          .map((child) => (
            <Grid key={child.id} item xs={3}>
              <Child
                files={childFiles}
                children={children}
                setChildren={setChildren}
                user={user}
                child={child}
              ></Child>
            </Grid>
          ))}
      </Grid>
      <Modal open={open} onClose={handleClose}>
        <EditChild
          action={"Create"}
          title={"Create Child Entry"}
          handleClose={handleClose}
          setOpen={setOpen}
          children={children}
          setChildren={setChildren}
        ></EditChild>
      </Modal>
      <Typography sx={{ textAlign: "center", mt: 2, mb: 1 }} variant='h4'>
        Guardian Children
      </Typography>

      <Grid container spacing={1.5} justifyContent='center'>
        {children
          ?.filter((c) => c.guardians.includes(user.username))
          .map((child) => (
            <Grid key={child.id} item xs={3}>
              <Child
                files={childFiles}
                children={children}
                setChildren={setChildren}
                user={user}
                child={child}
              ></Child>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};

export default Children;
