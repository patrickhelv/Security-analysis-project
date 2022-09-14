import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { useHistory } from "react-router-dom";

const Invalid = (props) => {
  const history = useHistory();
  return (
    <Container>
      <Typography sx={{ textAlign: "center" }} variant='h1'>
        Invalid link
      </Typography>

      <Link
        component='button'
        underline='hover'
        onClick={() => history.push("/signup")}
      >
        Not registered? Click here to sign up!
      </Link>
    </Container>
  );
};
export default Invalid;
