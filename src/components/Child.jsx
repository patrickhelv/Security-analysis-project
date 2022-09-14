import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import EditChild from "./EditChild";
import Modal from "@mui/material/Modal";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import ChildrenService from "../services/children";
import { Stack } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const DOMPurify = require('dompurify')(window);

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Child = ({ child, user, children, setChildren, files }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [expanded, setExpanded] = React.useState(false);

  const [childFiles, setChildFiles] = useState(files);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const handleConfirmOpen = () => setConfirmOpen(true);
  const handleConfirmClose = () => setConfirmOpen(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const deleteChild = (e) => {
    e.preventDefault();

    ChildrenService.DeleteChild(child.id).then((response) => {
      console.log("Child entry deleted");
      ChildrenService.GetChildren().then((c) => setChildren(c)); // Reload data from backend
    });
  };

  const uploadFile = (e) => {
    e.preventDefault();

    let formData = new FormData();

    formData.append("file", selectedFile);
    formData.append("child", child.id);
    ChildrenService.UploadChildFile(formData)
      .then((response) => {
        console.log("File uploaded");
        ChildrenService.GetChildFileInfos().then((c) => setChildFiles(c));
      })
      .catch((error) => console.error(error));
  };

  const downloadFile = (url) => {
    ChildrenService.DownloadChildFile(url)
      .then((response) => {
        const file = new File([response], url, { type: response.type });
        window.open(URL.createObjectURL(file));
      })
      .catch((error) => console.error(error));
  };

  const deleteFile = (id) => {
    ChildrenService.DeleteChildFile(id)
      .then((response) => {
        console.log("Deleted file");
        setChildFiles(childFiles.filter((file) => file.id !== id));
      })
      .catch((err) => console.log(err));
  };

  const removeGuardian = (childId, guardian) => {
    ChildrenService.RemoveGuardian({ child: childId, guardian: guardian })
      .then((response) => {
        console.log("Removed Guardian");
        ChildrenService.GetChildren().then((c) => setChildren(c));
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant='h5' component='div'>
            {child.name}
          </Typography>
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(child.info) }}></div>
        </CardContent>

        <CardActions>
          {user?.username === child.parent ? (
            <div>
              <IconButton size='small' onClick={handleOpen}>
                <EditIcon />
              </IconButton>
              <IconButton size='small' onClick={handleConfirmOpen}>
                <DeleteIcon />
              </IconButton>
            </div>
          ) : null}
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label='show more'
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>

        {/* Contend inside dropdown */}
        <Collapse in={expanded} timeout='auto' unmountOnExit>
          {user.username === child.parent ? (
            <CardContent>
              <Typography variant='h5' component='div'>
                Guardians
              </Typography>
              {child.guardians?.map((g) => (
                <Stack spacing={2} direction='row' justifyContent='right'>
                  <Typography variant='h6' component='div'>
                    {g}
                  </Typography>
                  <IconButton
                    size='small'
                    onClick={() => removeGuardian(child.id, g)}
                  >
                    <ClearIcon />
                  </IconButton>
                </Stack>
              ))}
            </CardContent>
          ) : null}

          <CardContent>
            <Typography variant='h5' component='div'>
              Files
            </Typography>
            {childFiles
              ?.filter((file) => file.child === child.id)
              .map((file) => (
                <Stack spacing={2} direction='row' justifyContent='right'>
                  <Button
                    key={file.id}
                    component='button'
                    onClick={() => downloadFile(file.link)}
                    underline='hover'
                  >
                    {file.name}
                  </Button>
                  {user.username === child.parent ? (
                    <IconButton
                      size='small'
                      onClick={() => deleteFile(file.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  ) : null}
                </Stack>
              ))}
            {user.username === child.parent ? (
              <input
                type='file'
                onChange={(e) => setSelectedFile(e.target.files[0])}
              ></input>
            ) : null}
          </CardContent>

          {user.username === child.parent ? (
            <CardActions>
              <Button onClick={uploadFile}>Upload file</Button>
            </CardActions>
          ) : (
            <CardActions>
              <Button
                variant='contained'
                onClick={() => removeGuardian(child.id, user.username)}
              >
                Quit as guardian
              </Button>
            </CardActions>
          )}
        </Collapse>
      </Card>
      <Modal open={open} onClose={handleClose}>
        <EditChild
          children={children}
          setChildren={setChildren}
          action={"Edit"}
          title={"Edit Child Entry"}
          handleClose={handleClose}
          child={child}
          setOpen={setOpen}
        ></EditChild>
      </Modal>
      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{"Delete child entry?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete this child entry? This cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>No</Button>
          <Button onClick={deleteChild} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Child;
