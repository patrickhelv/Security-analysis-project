import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { useHistory } from "react-router-dom";

const Verified = (props) => {
  const history = useHistory();
  return (
    <Container>
      <Typography sx={{ textAlign: "center" }} variant='h1'>
        User successfully verified!
      </Typography>
      <Typography sx={{ textAlign: "center" }} variant='h5'>
        You can now log in to the application.
      </Typography>
      <Link
        component='button'
        underline='hover'
        onClick={() => history.push("/login")}
      >
        Click here to go to the login page
      </Link>
    </Container>
  );
};
export default Verified;
