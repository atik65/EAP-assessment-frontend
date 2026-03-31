const endpoint = "/api/restock";

const restockQueueApi = {
  cacheKey: "restockQueue",
  list: {
    endpoint,
    path: "/",
    method: "get",
  },
  show: (id) => ({
    endpoint,
    path: `/${id}/`,
    method: "get",
  }),
  restock: (id) => ({
    endpoint,
    path: `/${id}/restock/`,
    method: "post",
  }),
  delete: (id) => ({
    endpoint,
    path: `/${id}/`,
    method: "delete",
  }),
};

export default restockQueueApi;
