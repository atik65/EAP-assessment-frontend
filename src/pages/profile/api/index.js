const endpoint = "/api/auth";

const profileApi = {
  cacheKey: "userProfile",
  show: {
    endpoint,
    path: "/me",
    method: "get",
  },
  update: {
    endpoint,
    path: "/update",
    method: "put",
  },
  changePassword: {
    endpoint,
    path: "/change-password",
    method: "post",
  },
};

export default profileApi;
