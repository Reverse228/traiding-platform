import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "@/utils/constants";

export const axiosMutation = async <ReturnedData, DataType = unknown>(
  mutationType: "post" | "patch" | "delete",
  path: string,
  data?: DataType,
  isContentType?: boolean,
  tokenNotRequired?: boolean,
) => {
  const clearPath = path.startsWith("/") ? path.substring(1) : path;

  const token = Cookies.get("token");
  const headers = { Authorization: token };
  isContentType &&
    Object.assign(headers, { "Content-type": "multipart/form-data" });

  if (mutationType === "delete") {
    return await axios
      .delete<ReturnedData>(`${API_URL}/${clearPath}`, { headers })
      .then((res) => res.data);
  }

  return await axios[mutationType]<ReturnedData>(
    `${API_URL}/${clearPath}`,
    data,
    tokenNotRequired
      ? {}
      : {
          headers,
        },
  ).then((res) => res.data);
};
