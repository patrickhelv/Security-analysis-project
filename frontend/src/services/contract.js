import api from "./api";

const GetContracts = () => {
  const request = api.get("/contracts/");
  return request.then((response) => response.data);
};

const FinishContract = (data) => {
  const request = api.post("/finish_contract/", data);
  return request.then((response) => response.data);
};

const ContractsService = {
  GetContracts,
  FinishContract,
};

export default ContractsService;
