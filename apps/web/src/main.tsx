import 'antd/dist/antd.dark.css';
import * as ReactDOM from 'react-dom';
import { App } from './app/app';
import { environment } from './environments/environment.prod';
import { getLogger } from '@xairline/shared-logger';
process.env.PRODUCTION = environment.production ? 'true' : 'false';
getLogger();
ReactDOM.render(<App />, document.getElementById('root'));
