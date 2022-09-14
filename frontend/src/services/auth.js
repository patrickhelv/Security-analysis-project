import api from "./api";
import TokenService from "./token";

const createUser = (credentials) => {
  return api.post(`/register/`, credentials).then((response) => {
    if (response.data.access) {
      TokenService.setUser(response.data.user);
      TokenService.updateLocalAccessToken(response.data.access);
      TokenService.setLocalRefreshToken(response.data.refresh);
    }

    return response.data;
  });
};

const login = (credentials) => {
  return api.post("/login/", credentials).then((response) => {
    if (response.data.access) {
      TokenService.setUser(response.data.user);
      TokenService.updateLocalAccessToken(response.data.access);
      TokenService.setLocalRefreshToken(response.data.refresh);
    }

    return response.data;
  });
};

const forgotPassword = (credentials) => {
  const request = api.post("/request-reset-password/", credentials);

  return request.then((response) => response.data);
};

const newPassword = (data) => {
  const request = api.post(`/reset-password-validate/`, data);

  return request.then((response) => response.data);
};

const logout = () => {
  const request = { refresh: window.localStorage.getItem("refresh_token")};
  TokenService.removeUser();
  return api.post("/logout/", request);
  
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const getMFAToken = () => {
  return api.get('/mfa/').then((response)=>{
    return {'mfa_token': response.data.mfa_token, 'active': response.data.active}
  })
}

const postMFAToken = (otp) => {
  return api.post('/mfa/', {'otp': otp})
}

const postMFALogin = (otp) => {
  return api.post('/mfaLogin/', otp).then((response) => {
    if (response.data.access) {
      TokenService.setUser(response.data.user);
      TokenService.updateLocalAccessToken(response.data.access);
      TokenService.setLocalRefreshToken(response.data.refresh);
    }

    return response.data;
  });
}

const AuthService = {
  createUser,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  newPassword,
  getMFAToken,
  postMFAToken,
  postMFALogin
};

export default AuthService;
