import api from "./api";

const GetAllAdverts = () => {
  const request = api.get("/adverts/");
  return request.then((response) => response.data);
};

const GetAllAdvertsOrderBy = (order_by) => {
  const request = api.get(`/adverts/?order_by=${order_by}`);
  return request.then((response) => response.data);
};

const GetAdvert = (id) => {
  const request = api.get(`/adverts/${id}/`);
  return request.then((response) => response.data);
};

const GetNeedSitterAdverts = () => {
  const request = api.get("/adverts/needsitter/");
  return request.then((response) => response.data);
};

const GetIsSitterAdverts = () => {
  const request = api.get("/adverts/issitter/");
  return request.then((response) => response.data);
};

const CreateIsSitterAdvert = (data) => {
  const request = api.post("/adverts/issitter/", data);
  return request.then((response) => response.data);
};

const CreateNeedSitterAdvert = (data) => {
  const request = api.post("/adverts/needsitter/", data);
  return request.then((response) => response.data);
};

const EditAdvert = (id, data) => {
  const request = api.patch(`/adverts/${id}/`, data);
  return request.then((response) => response.data);
};

const DeleteAdvert = (id) => {
  const request = api.delete(`/adverts/${id}/`);
  return request.then((response) => response.data);
};
const AdvertsService = {
  GetAllAdverts,
  GetAdvert,
  GetNeedSitterAdverts,
  GetIsSitterAdverts,
  CreateIsSitterAdvert,
  CreateNeedSitterAdvert,
  EditAdvert,
  DeleteAdvert,
  GetAllAdvertsOrderBy,
};

export default AdvertsService;
