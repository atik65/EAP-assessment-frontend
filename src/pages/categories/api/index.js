const endpoint = "/api/categories";

const categoryApi = {
  cacheKey: "categories",
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
  update: (id) => ({
    endpoint,
    path: `/${id}/`,
    method: "patch",
  }),
  delete: (id) => ({
    endpoint,
    path: `/${id}/`,
    method: "delete",
  }),
  show: (id) => ({
    endpoint,
    path: `/${id}/`,
    method: "get",
  }),
};

export default categoryApi;
