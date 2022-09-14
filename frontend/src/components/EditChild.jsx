import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ChildrenService from "../services/children";

const EditChild = (props) => {
  const [name, setName] = useState("");
  const [info, setInfo] = useState("");

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const request = {
      name: name,
      info: info,
    };
    if (props.action === "Create") {
      console.log(request);

      ChildrenService.CreateChild(request)
        .then((newChild) => {
          console.log(newChild);
          // Update children and open popup snackbar
          props.setChildren(props.children.concat(newChild));
          props.setOpen(false);
        })
        .catch((err) => console.log(err.response?.data));
    } else if (props.action === "Edit") {
      ChildrenService.EditChild(props.child.id, request)
        .then((editChild) => {
          let t = props.children.filter((c) => c.id !== props.child.id);
          // Update children and open popup snackbar
          props.setChildren(t.concat(editChild));
          props.setOpen(false);
        })
        .catch((err) => console.log(err.response?.data));
    }
  };

  return (
    <Box sx={style}>
      <Typography sx={{ textAlign: "center" }} variant="h3">
        {props.title}
      </Typography>
      <form onSubmit={onSubmit}>
        <Stack spacing={2} padding={2}>
          <TextField
            onInput={(e) => setName(e.target.value)}
            value={name}
            label={"Name"}
            required
          />
          <TextField
            multiline
            minRows={2}
            onInput={(e) => setInfo(e.target.value)}
            value={info}
            label={"Info"}
            required
          />
          <Stack spacing={2} direction="row" justifyContent="center">
            <Button
              variant="contained"
              color="error"
              onClick={props.handleClose}
            >
              Cancel
            </Button>
            <Button variant="contained" color="success" type="submit">
              {props.action}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};

export default EditChild;
