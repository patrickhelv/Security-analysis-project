import api from "./api";

const GetOffers = () => {
  const request = api.get("/offers/");
  return request.then((response) => response.data);
};

const CreateOffer = (data) => {
  const request = api.post("/offers/", data);
  return request.then((response) => response.data);
};

const AnswerOffer = (data) => {
  const request = api.post("/offer_answer/", data);
  return request.then((response) => response.data);
};

const OfferService = { GetOffers, CreateOffer, AnswerOffer };

export default OfferService;
