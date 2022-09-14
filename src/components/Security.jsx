import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import AuthService from "../services/auth";
import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import TextField from "@mui/material/TextField";

const Security = ({ user }) => {
  const [mfa_token, setHash] = useState("");
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [OTPErrorText, setOTPErrorText] = useState("");

  const enableMFA = () => {
    AuthService.getMFAToken().then((data) => {
      setHash(data["mfa_token"]);
      setVerified(data["verified"]);
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    AuthService.postMFAToken(otp)
      .then((verified) => {
        setVerified(verified);
      })
      .catch((err) => {
        console.log(err);
        setOTPErrorText("Wrong one-time-password");
      });
  };

  useEffect(() => {
    //Runs on the first render
    //And any time any dependency value changes
  }, [mfa_token, verified]);

  return (
    <Container sx={{ textAlign: "center" }}>
      <Typography sx={{ textAlign: "center" }} variant='h2'>
        Security
      </Typography>
      <Typography variant='h5'>
          Welcome to the Security page. Here you can activate two factor authentication for your account.
        </Typography>
      <Typography>User: {user?.username}</Typography>
      <Typography>Email: {user?.email}</Typography>
      {!verified && !mfa_token ? (
        <Typography>
          <Button variant='contained' color='secondary' onClick={enableMFA}>
            SHOW MFA
          </Button>
        </Typography>
      ) : null}
      {mfa_token ? (
        <Container>
          <QRCode value={mfa_token} />
        </Container>
      ) : null}
      {!verified && mfa_token ? (
        <Container>
          <Typography>Verify one-time-password:</Typography>
          <form onSubmit={onSubmit}>
            <TextField
              onInput={(e) => setOtp(e.target.value)}
              label='One-time-password'
              error={!!OTPErrorText}
              helperText={OTPErrorText}
            />
          </form>
        </Container>
      ) : null}
      {verified ? (
        <Typography>MFA has been activated on this account</Typography>
      ) : null}
    </Container>
  );
};
export default Security;
