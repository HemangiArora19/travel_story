import axios from 'axios';
import  {BASE_URL

} from './constants';

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: BASE_URL, // Replace with your actual API base URL
  timeout: 10000, // Timeout after 10 seconds (adjust as needed)
});

// Add a request interceptor to attach the token to every request if available
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Retrieve the access token from localStorage
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       // If token exists, add it to the Authorization header
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     // If an error occurs during request setup, reject the promise
//     return Promise.reject(error);
//   }
// );
axiosInstance.interceptors.response.use(
  (response) => {
    // If the response is successful, return it as is
    return response;
  },
  async (error) => {
    // If the response has a 401 status code, handle token refresh
    if (error.response && error.response.status === 401) {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          // Call the API to refresh the access token
          const refreshResponse = await axios.post(`${BASE_URL}/refresh-token`, {
            token: refreshToken,
          });
          const newAccessToken = refreshResponse.data.accessToken;

          // Update the access token in localStorage
          localStorage.setItem('accessToken', newAccessToken);

          // Retry the original request with the new token
          error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(error.config);
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        // Logout user or redirect to login if refresh fails
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
// import axios from 'axios';
// import { BASE_URL } from './constants';

// // Create an Axios instance with default configuration
// const axiosInstance = axios.create({
//   baseURL: BASE_URL, // Replace with your actual API base URL
//   timeout: 10000, // Timeout after 10 seconds (adjust as needed)
// });

// // Add a request interceptor to attach the token to every request if available
// axiosInstance.interceptors.request.use(
//   (config) => {
//     console.log('Interceptor called. Config:', config);
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//       console.log('Token attached to headers:', config.headers);
//     } else {
//       console.log('No token found in localStorage.');
//     }
//     return config;
//   },
//   (error) => {
//     console.error('Interceptor error:', error);
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
