import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ContractsService from "../services/contract";
import ChildrenService from "../services/children";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Stack } from "@mui/material";

// Custom box style
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

// Custom rotating expanding icon
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

const Contract = ({ user, contract, contracts, setContracts }) => {
  const [children, setChildren] = useState(null);

  const [openChildren, setOpenChildren] = useState(false);
  const handleOpenChildren = () => setOpenChildren(true);
  const handleCloseChildren = () => setOpenChildren(false);

  useEffect(() => {
    console.log("effect");
    ChildrenService.GetActiveContractChildren().then((c) => setChildren(c));
  }, []);

  const finishContract = (e) => {
    e.preventDefault();

    ContractsService.FinishContract({ contractId: contract.contractId })
      .then((response) => {
        console.log(response);
        setOpen(false);
        contract.finished = true;
        let updated = contracts.filter(
          (c) => c.contractId !== contract.contractId
        );

        updated = updated.concat(contract);
        setContracts(updated);
        // TODO: Snackbar confirmation
      })
      .catch((error) => {
        console.log(error.response?.data);
      });
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {contract.date}
          </Typography>
          <Typography variant="h6" component="div">
            Parent: {contract.parent}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary">
            E-mail: {contract.parentEmail}
          </Typography>
          <Typography variant="h6" component="div">
            Sitter: {contract.sitter}
          </Typography>

          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {contract.start_time} -- {contract.end_time}
          </Typography>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography variant="body2">{contract.content}</Typography>
            </CardContent>
          </Collapse>
        </CardContent>

        <CardActions>
          {user?.username === contract.parent && !contract.finished ? (
            <div>
              <Button onClick={handleOpen} size="small">
                Finish Contract
              </Button>
            </div>
          ) : contract.finished ? null : (
            <div>
              <Button onClick={handleOpenChildren} size="small">
                Show children
              </Button>
            </div>
          )}
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
      </Card>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Finish contract"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to finish the contract?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={finishContract} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Modal open={openChildren} onClose={handleCloseChildren}>
        <Box sx={style}>
          <Grid container spacing={1.5} justifyContent="center">
            {children
              ?.filter((c) => c.parent === contract.parent)
              .map((child) => (
                <Grid key={child.id} item xs={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {child.name}
                      </Typography>
                      {child.info}

                      <Typography variant="h6" component="div">
                        Guardians
                      </Typography>
                      {child.guardians?.map((g) => (
                        <Stack
                          spacing={2}
                          direction="row"
                          justifyContent="right"
                        >
                          <Typography variant="body" component="div">
                            {g}
                          </Typography>
                        </Stack>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default Contract;
