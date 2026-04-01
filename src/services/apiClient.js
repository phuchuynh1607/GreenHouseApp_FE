import axios from "axios";
import { decode } from "base-64";
import { tokenStorage } from "../tokenStorage/tokenStorage";

const BASE_URL = "http://10.10.67.126:8000";

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});
/* ======================
   REQUEST INTERCEPTOR
====================== */
instance.interceptors.request.use(
  async (config) => {
    const accessToken = await tokenStorage.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/* ======================
   RESPONSE INTERCEPTOR 
====================== */
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra lỗi 401 và đảm bảo chưa retry lần nào
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("--- Interceptor đang thử Refresh Token ---");

        const refreshToken = await tokenStorage.getRefreshToken();

        // GIỐNG LƯU Ý BẠN TÌM ĐƯỢC: Dùng 'axios' gốc (không dùng instance)
        const response = await axios.post(`${BASE_URL}/auth/refresh`, null, {
          params: { refresh_token: refreshToken },
        });

        const { access_token, refresh_token: new_refresh_token } =
          response.data;

        // Lưu token mới vào bộ nhớ điện thoại
        await tokenStorage.setTokens(
          access_token,
          new_refresh_token || refreshToken,
        );

        // Gắn token mới vào request bị lỗi lúc nãy và chạy lại
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return instance(originalRequest);
      } catch (refreshError) {
        console.log("❌ Refresh Token thất bại:", refreshError);

        // Thay vì window.location, ta xóa token để AuthProvider đá user ra ngoài
        await tokenStorage.clearTokens();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default instance;
