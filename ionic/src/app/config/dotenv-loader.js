const dotenv = require('dotenv');

dotenv.config();

const env = {
  test: process.env.TEST || 'default_Test2',
  firebase: {
    apiKey: process.env.APIKEY || 'file .env not found',
    authDomain: process.env.AUTHDOMAIN || 'file .env not found',
    databaseURL: process.env.DATABASEURL || 'file .env not found',
    projectId: process.env.PROJECTID || 'file .env not found',
    storageBucket: process.env.STORAGEBUCKET || 'file .env not found',
    messagingSenderId: process.env.MESSAGINGSENDERID || 'file .env not found',
    appId: process.env.APPID || 'file .env not found',
  },
  googleMapsApiKey: process.env.GOOGLEMAPSAPIKEY || 'file .env not found',
};

module.exports = () => {
  return {
    code: 'module.exports = ' + JSON.stringify(env)
  };
};