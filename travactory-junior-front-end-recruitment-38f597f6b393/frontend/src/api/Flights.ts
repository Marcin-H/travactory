import { makeServiceCall } from './utils';

export const getFlightsList = () => {
  return makeServiceCall('flights', 'GET');
};

export const getFlightDetails = (id: string) => {
  return makeServiceCall(`flights/${id}`, 'GET');
};

export const bookFlight = (id: string) => {
  return makeServiceCall(`flights`, 'POST', { uuid: id });
};
