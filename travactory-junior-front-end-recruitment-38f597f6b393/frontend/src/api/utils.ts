import axios, { Method } from 'axios';

interface PayloadProps {
  body?: undefined | Record<string, unknown> | unknown;
}

export const makeServiceCall: any = async (url: string, httpMethod: Method, payload: PayloadProps) => {
  const response = await axios({
    method: httpMethod,
    url: `http://localhost:3001/${url}`,
    data: payload?.body || {},
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};
