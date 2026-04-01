const endpoint = "/api/activity";

const activityLogApi = {
  cacheKey: "activityLogs",
  list: {
    endpoint,
    path: "/",
    method: "get",
  },
};

export default activityLogApi;
