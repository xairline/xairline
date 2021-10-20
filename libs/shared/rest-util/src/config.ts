import { Configuration } from '@xairline/shared-rest-client-remote';
export const remoteConfiguration = new Configuration({
  basePath: process.env.PRODUCTION
    ? 'https://xairline.herokuapp.com'
    : 'https://xairline.herokuapp.com',
});
