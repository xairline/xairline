import { environment } from '../environments/environment';
import { Configuration } from '../rest-client';

export const configuration = new Configuration({
  basePath: 'http://localhost:4200',
});

export const remoteConfiguration = new Configuration({
  basePath: environment.production
    ? 'https://xairline.herokuapp.com'
    : 'https://xairline.herokuapp.com',
});
