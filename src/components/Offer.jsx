import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import OfferService from "../services/offers";
import AdvertsService from "../services/adverts";
import { Stack } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

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

const Offer = ({ offer, user, onUpdate }) => {
  const [advert, setAdvert] = useState(null);

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const answerOffer = (status) => {
    OfferService.AnswerOffer({ offerId: offer.id, status: status })
      .then((answer) => {
        console.log(answer);
        onUpdate();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (offer.advert !== null) {
      console.log("effect");
      AdvertsService.GetAdvert(offer.advert)
        .then((ad) => setAdvert(ad))
        .catch((err) => console.log(err));
    }
  }, []);

  // Map status code to verbose name for convenience
  const states = { P: "Pending", D: "Declined", A: "Accepted" };

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant='body' component='div'>
            Status: {states[offer.status]}
          </Typography>
          <Typography variant='body' component='div'>
            Sender: {offer.sender}
          </Typography>
          <Typography variant='body' component='div'>
            Recipient: {offer.recipient}
          </Typography>

          {offer.offerType === "JOB_OFFER" && advert !== null ? (
            <>
              <CardActions>
                <Typography sx={{ fontSize: 16 }} color='text.secondary'>
                  Show details
                </Typography>
                <ExpandMore
                  expand={expanded}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label='show more'
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              </CardActions>
              <Collapse in={expanded} timeout='auto' unmountOnExit>
                <Card>
                  <CardContent>
                    <Typography sx={{ fontSize: 14 }} color='text.secondary'>
                      Type:{" "}
                      {advert.advertType === "IS_SITTER"
                        ? "Is Babysitter"
                        : "Need Babysitter"}
                    </Typography>
                    <Typography color='text.secondary'>
                      {advert.date}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color='text.secondary'>
                      {advert.start_time} -- {advert.end_time}
                    </Typography>
                    <Typography
                      sx={{ mb: 1.3 }}
                      variant='body1'
                      component='div'
                    >
                      Owner: {advert.owner}
                    </Typography>
                    <Typography variant='body2'>{advert.content}</Typography>
                  </CardContent>
                </Card>
              </Collapse>
            </>
          ) : null}
        </CardContent>

        <CardActions>
          {user?.username === offer.recipient && offer.status === "P" ? (
            <Stack spacing={2} direction='row' justifyContent='center'>
              <Button
                size='small'
                variant='contained'
                color='error'
                onClick={() => answerOffer("D")}
              >
                Decline
              </Button>
              <Button
                size='small'
                variant='contained'
                color='success'
                onClick={() => answerOffer("A")}
              >
                Accept
              </Button>
            </Stack>
          ) : null}
        </CardActions>
      </Card>
    </>
  );
};

export default Offer;
