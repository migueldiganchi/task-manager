import axios from "axios";

const appInstance = new axios.create({
  baseURL: "http://localhost:9001",
});

appInstance.defaults.headers.get["Accepts"] = "application/json";

export default appInstance;
