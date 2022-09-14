import api from "./api";

const GetChildren = () => {
  const request = api.get("/children/");
  return request.then((response) => response.data);
};

const CreateChild = (data) => {
  const request = api.post("/children/", data);
  return request.then((response) => response.data);
};

const EditChild = (id, data) => {
  const request = api.patch(`/children/${id}/`, data);
  return request.then((response) => response.data);
};

const DeleteChild = (id, data) => {
  const request = api.delete(`/children/${id}/`, data);
  return request.then((response) => response.data);
};

const UploadChildFile = (data) => {
  const request = api.post("/child-file/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return request.then((response) => response.data);
};

const GetChildFileInfos = () => {
  const request = api.get("/child-file/");
  return request.then((response) => response.data);
};

const DownloadChildFile = (url) => {
  const request = api.get(url, { responseType: "blob" });
  return request.then((response) => response.data);
};

const DeleteChildFile = (id) => {
  const request = api.delete(`/child-file/${id}/`);
  return request.then((response) => response.data);
};

const RemoveGuardian = (data) => {
  const request = api.post("/remove-guardian/", data);
  return request.then((response) => response.data);
};

const GetActiveContractChildren = () => {
  const request = api.get("/active-contract-children/");
  return request.then((response) => response.data);
};

const ChildrenService = {
  GetChildren,
  CreateChild,
  EditChild,
  DeleteChild,
  UploadChildFile,
  GetChildFileInfos,
  DownloadChildFile,
  DeleteChildFile,
  RemoveGuardian,
  GetActiveContractChildren,
};

export default ChildrenService;
