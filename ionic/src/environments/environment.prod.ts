import { dotenv } from '../app/config/dotenv';

export const environment = {
  production: true,
  firebase: dotenv.firebase,
  googleMapsApiKey: dotenv.googleMapsApiKey
};
