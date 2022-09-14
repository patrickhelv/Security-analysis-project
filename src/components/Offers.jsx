import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Offer from "./Offer";
import OfferService from "../services/offers";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

const Offers = ({ user }) => {
  const [offers, setOffers] = useState(null);
  const [recipient, setRecipient] = useState("");

  const [offerType, setOfferType] = useState("JOB_OFFER");
  const handleOfferTypeChange = (event, newType) => {
    setOfferType(newType);
  };

  const [pendingChecked, setPendingChecked] = useState(true);

  const handlePendingChange = (event) => {
    setPendingChecked(event.target.checked);
  };
  const [answeredChecked, setAnsweredChecked] = useState(true);

  const handleAnsweredChange = (event) => {
    setAnsweredChecked(event.target.checked);
  };
  const [senderChecked, setSenderChecked] = useState(true);

  const handleSenderChange = (event) => {
    setSenderChecked(event.target.checked);
  };
  const [recipientChecked, setRecipientChecked] = useState(true);

  const handleRecipientChange = (event) => {
    setRecipientChecked(event.target.checked);
  };

  useEffect(() => {
    console.log("effect");
    handleUpdate();
  }, []);

  const handleUpdate = () => {
    OfferService.GetOffers().then((o) => setOffers(o));
  };
  const sendOffer = (e) => {
    e.preventDefault();
    OfferService.CreateOffer({
      recipient: recipient,
      offerType: "GUARDIAN_OFFER",
    })
      .then((o) => setOffers(offers.concat(o)))
      .catch((err) => console.log(err));
  };

  return (
    <Container>
      <Stack spacing={2} margin={5} justifyContent='center'>
        <Typography sx={{ textAlign: "center" }} variant='body'>
          Welcome to the Offers page. Here you can find all pending and
          previously answer offers. Accept or decline the offers by clicking the
          buttons. You can also send a Guardian offer from this page, asking
          another user if you can become guardian for their children.
        </Typography>

        <ToggleButtonGroup
          sx={{ justifyContent: "center" }}
          value={offerType}
          exclusive
          onChange={handleOfferTypeChange}
          color='primary'
        >
          <ToggleButton value='JOB_OFFER' aria-label='left aligned'>
            Show job offers
          </ToggleButton>
          <ToggleButton value='GUARDIAN_OFFER' aria-label='centered'>
            Show guardian offers
          </ToggleButton>
        </ToggleButtonGroup>
        <FormControl component='fieldset'>
          <FormGroup
            aria-label='position'
            sx={{ justifyContent: "center" }}
            row
          >
            <FormControlLabel
              value='top'
              control={
                <Checkbox
                  defaultChecked
                  checked={pendingChecked}
                  onChange={handlePendingChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label='Show Pending'
              labelPlacement='top'
            />
            <FormControlLabel
              value='start'
              control={
                <Checkbox
                  defaultChecked
                  checked={answeredChecked}
                  onChange={handleAnsweredChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label='Show Answered'
              labelPlacement='top'
            />
            <FormControlLabel
              value='bottom'
              control={
                <Checkbox
                  defaultChecked
                  checked={senderChecked}
                  onChange={handleSenderChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label='You Are Sender'
              labelPlacement='top'
            />
            <FormControlLabel
              value='end'
              control={
                <Checkbox
                  defaultChecked
                  checked={recipientChecked}
                  onChange={handleRecipientChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label='You Are Recipient'
              labelPlacement='top'
            />
          </FormGroup>
        </FormControl>
      </Stack>
      {offerType === "GUARDIAN_OFFER" ? (
        <Stack spacing={2} margin={5} direction='row' justifyContent='center'>
          <TextField
            onInput={(e) => setRecipient(e.target.value)}
            value={recipient}
            label={"Offer Recipient Username"}
            required
          />
          <Button variant='contained' color='secondary' onClick={sendOffer}>
            Send Guardian offer
          </Button>
        </Stack>
      ) : null}
      {pendingChecked ? (
        <>
          <Typography sx={{ textAlign: "center", mb: 1 }} variant='h3'>
            Pending offers
          </Typography>
          <Grid container spacing={1.5} justifyContent='center'>
            {offers
              ?.filter(
                // Filter buttons logic
                (o) =>
                  o.status === "P" &&
                  o.offerType === offerType &&
                  (user?.username !== o.recipient || recipientChecked) &&
                  (user?.username !== o.sender || senderChecked)
              )
              .map((o) => (
                <Grid key={o.id} item xs={3}>
                  <Offer
                    onUpdate={() => handleUpdate()}
                    offer={o}
                    user={user}
                  ></Offer>
                </Grid>
              ))}
          </Grid>{" "}
        </>
      ) : null}

      {answeredChecked ? (
        <>
          <Typography sx={{ textAlign: "center", mt: 2, mb: 1 }} variant='h3'>
            Answered offers
          </Typography>
          <Grid container spacing={1.5} justifyContent='center'>
            {offers
              ?.filter(
                // Filter buttons logic
                (o) =>
                  o.status !== "P" &&
                  o.offerType === offerType &&
                  (user?.username !== o.recipient || recipientChecked) &&
                  (user?.username !== o.sender || senderChecked)
              )
              .map((o) => (
                <Grid key={o.id} item xs={3}>
                  <Offer
                    onUpdate={() => handleUpdate()}
                    offer={o}
                    user={user}
                  ></Offer>
                </Grid>
              ))}
          </Grid>
        </>
      ) : null}
    </Container>
  );
};

export default Offers;
