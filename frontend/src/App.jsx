import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import { useHistory } from "react-router-dom";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Adverts from "./components/Adverts";
import Children from "./components/Children";
import Offers from "./components/Offers";
import Verified from "./components/Verified";
import Invalid from "./components/Invalid";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Contracts from "./components/Contracts";
import Security from "./components/Security";
import Home from "./components/Home";
import Avatar from "@mui/material/Avatar";
import ResetPassword from "./components/ResetPassword";
import AuthService from "./services/auth";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const App = () => {
  const [user, setUser] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");

  const signOut = () => {

    AuthService.logout()
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("refresh_token");
    window.localStorage.removeItem("access_token");
    setUser(null);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("user");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, [] );

  return (
    <Router>
      <AppBar position='static'>
        <Toolbar>
          <Grid container>
            <Grid item>
              <Button size='small' component={Link} to='/'>
                <Avatar alt='Home' src='favicon.ico' />
              </Button>
            </Grid>
            {user ? (
              <Grid item>
                <Button color='inherit' component={Link} to='/adverts'>
                  adverts
                </Button>
                <Button color='inherit' component={Link} to='/children'>
                  children
                </Button>
                <Button color='inherit' component={Link} to='/offers'>
                  offers
                </Button>
                <Button color='inherit' component={Link} to='/contracts'>
                  contracts
                </Button>
                <Button color='inherit' component={Link} to='/security'>
                  security
                </Button>
              </Grid>
            ) : null}
          </Grid>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              {user ? (
                <Button
                  color='inherit'
                  onClick={signOut}
                  component={Link}
                  to='/login'
                >
                  Sign Out
                </Button>
              ) : (
                <div>
                  <Button color='inherit' component={Link} to='/login'>
                    Sign In
                  </Button>
                  <Button
                    variant='outlined'
                    color='inherit'
                    component={Link}
                    to='/signup'
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Container maxWidth='md'>
        <Switch>
          <Route path='/login'>
            <LoginForm
              setAppSnackbarOpen={setSnackbarOpen}
              setAppSnackbarText={setSnackbarText}
              setUser={setUser}
            />
          </Route>
          <Route path='/signup'>
            <SignupForm
              setAppSnackbarOpen={setSnackbarOpen}
              setAppSnackbarText={setSnackbarText}
              setUser={setUser}
            />
          </Route>
          <Route path='/adverts'>
            <Adverts user={user} />
          </Route>
          <Route path='/children'>
            <Children user={user} />
          </Route>
          <Route path='/offers'>
            <Offers user={user} />
          </Route>
          <Route path='/verified'>
            <Verified />
          </Route>
          <Route path='/invalid'>
            <Invalid />
          </Route>
          <Route path='/new_password'>
            <ResetPassword />
          </Route>
          <Route path='/contracts'>
            <Contracts user={user} />
          </Route>
          <Route path='/security'>
            <Security user={user} />
          </Route>
          <Route path='/'>
            <Home setUser={setUser} />
          </Route>
        </Switch>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity='success'
            sx={{ width: "100%" }}
          >
            {snackbarText}
          </Alert>
        </Snackbar>
      </Container>
    </Router>
  );
};

export default App;
