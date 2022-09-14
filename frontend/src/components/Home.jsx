import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useHistory } from "react-router-dom";
import Link from "@mui/material/Link";
const Home = ({ setUser }) => {
  const history = useHistory();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("user");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user)
      history.push("/adverts");
    }
  }, []);

  return (
    <Container maxWidth="xl">
      <Stack
        spacing={2}
        padding={2}
        justifyContent="center"
        alignItems="center"
      >
        <Typography sx={{ textAlign: "center" }} variant="h4">
          Welcome to TrustedSitters, the most secure babysitting booking
          application on the web!!!
        </Typography>
        <img
          alt="logo"
          align="center"
          src="/baby-stroller (4).png"
          width="300"
          height="300"
        />
        <Typography sx={{ textAlign: "center" }} variant="body">
          Whether you are a babysitter looking for work, or a parent needing
          someone to look after your kids, this is the place for you!
        </Typography>
        <Button onClick={() => history.push("/signup")} variant="contained">
          Click here to sign up
        </Button>
        <Link
          component="button"
          underline="hover"
          onClick={() => history.push("/login")}
        >
          Already registered? Click here to sign in!
        </Link>
      </Stack>
    </Container>
  );
};

export default Home;
