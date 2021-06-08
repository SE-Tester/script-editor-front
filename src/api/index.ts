import axios, { AxiosError } from 'axios';
import { HOST, WITH_CRED } from '../config';
import * as AxiosLogger from 'axios-logger';

const axiosInstance = axios.create({
  baseURL: HOST,
  withCredentials: `${WITH_CRED}` === 'true',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((request) => {
  //const token = castRootState(store.getState()).session.tokenData;
  // if (request.data.useToken && token) {
  //   delete request.data.useToken;

  //   _.set(request.headers, 'Authorization', `Bearer ${token.access?.token}`);
  // }

  return AxiosLogger.requestLogger(request);
}, AxiosLogger.errorLogger);

axiosInstance.interceptors.response.use(
  AxiosLogger.responseLogger,
  (err: AxiosError) => {
    if (err.response) {
      if (err.response.request.status === 401) {
        // if (!err.config.headers.Authorization) {
        //   store.dispatch(fetchRefreshToken());
        // }
        // const body = _.get(err, 'response.request.body');
        // if (body && body.grantBy === 'refresh') {
        //   store.dispatch(logout());
        // }
      } else {
        AxiosLogger.errorLogger(err);
      }
    }
    return err.response || {};
  },
);
export default axiosInstance;
