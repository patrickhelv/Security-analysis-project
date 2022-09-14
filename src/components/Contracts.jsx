import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Contract from "./Contract";
import ContractsService from "../services/contract";

const Contracts = ({ user }) => {
  const [contracts, setContracts] = useState(null);

  useEffect(() => {
    console.log("effect");
    ContractsService.GetContracts().then((c) => setContracts(c));
  }, []);

  return (
    <Container>
      <Typography sx={{ textAlign: "center" }} variant='h2'>
        Contracts
      </Typography>
      <Typography sx={{ textAlign: "center" }} variant='body'>
        Welcome to the Contracts page. Here you can see your active contracts,
        and finished ones. If you are a babysitter, you can also see the
        information about children in active contracts.
      </Typography>
      <Typography sx={{ textAlign: "center", mt: 2, mb: 1 }} variant='h5'>
        Active Contracts
      </Typography>
      <Grid container spacing={1.5} justifyContent='center'>
        {contracts
          ?.filter((c) => c.finished === false)
          .map((contract) => (
            <Grid key={contract.id} item xs={3}>
              <Contract
                contracts={contracts}
                setContracts={setContracts}
                contract={contract}
                user={user}
              ></Contract>
            </Grid>
          ))}
      </Grid>
      <Typography sx={{ textAlign: "center", mt: 2, mb: 1 }} variant='h5'>
        Finished Contracts
      </Typography>
      <Grid container spacing={1.5} justifyContent='center'>
        {contracts
          ?.filter((c) => c.finished === true)
          .map((contract) => (
            <Grid key={contract.id} item xs={3}>
              <Contract contract={contract} user={user}></Contract>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};

export default Contracts;
