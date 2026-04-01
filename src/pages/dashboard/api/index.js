const endpoint = "/api/dashboard";

const dashboardApi = {
  cacheKey: "dashboardStats",
  stats: {
    endpoint,
    path: "/stats/",
    method: "get",
  },
};

export default dashboardApi;
