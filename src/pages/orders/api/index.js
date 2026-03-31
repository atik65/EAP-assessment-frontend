const endpoint = "/api/orders";

const orderApi = {
  cacheKey: "orders",
  list: {
    endpoint,
    path: "/",
    method: "get",
  },
  create: {
    endpoint,
    path: "/",
    method: "post",
  },
  show: (id) => ({
    endpoint,
    path: `/${id}/`,
    method: "get",
  }),
  updateStatus: (id) => ({
    endpoint,
    path: `/${id}/status/`,
    method: "patch",
  }),
  cancel: (id) => ({
    endpoint,
    path: `/${id}/cancel/`,
    method: "post",
  }),
};

export default orderApi;
