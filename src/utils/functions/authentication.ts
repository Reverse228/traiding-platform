import Cookies from "js-cookie";

let authToken: string | null = null;

export const setToken = async (token: string): Promise<boolean> => {
  try {
    authToken = token ? `Bearer ${token}` : "";
    Cookies.set("token", authToken, { expires: 7 });
    return true;
  } catch (error) {
    return false;
  }
};

export const destroyToken = () => {
  Cookies.remove("token");
};
