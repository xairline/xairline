import {
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { faPlaneDeparture } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Steps } from 'antd';
import { useObserver } from 'mobx-react-lite';
import { useStores } from '../../store';
import { Select } from '../select/select';
import './fly-now.module.css';
import Fly from './fly/fly';
import Load from './load/load';
import Report from './report/report';
const { Step } = Steps;
/* eslint-disable-next-line */
export interface FlyNowProps {}

export function FlyNow(props: FlyNowProps) {
  const { FlyNowStore } = useStores();
  const contents: Array<any> = [
    <Select />,
    <Load flyNowStore={FlyNowStore} />,
    <Fly />,
  ];
  return useObserver(() => {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          overflowX: 'hidden',
        }}
      >
        <Steps
          current={FlyNowStore.currentStep}
          // onChange={(value) => FlyNowStore.changeStep(value)}
          type="navigation"
          style={{
            background: '#354b6e',
          }}
        >
          <Step
            status={
              FlyNowStore.currentStep === 0
                ? 'process'
                : FlyNowStore.currentStep > 0
                ? 'finish'
                : 'wait'
            }
            title="Select Flight"
            icon={<UserOutlined />}
          />
          <Step
            status={
              FlyNowStore.currentStep === 1
                ? 'process'
                : FlyNowStore.currentStep > 1
                ? 'finish'
                : 'wait'
            }
            title="Load Passengers/Cargo"
            icon={<SolutionOutlined />}
          />
          <Step
            status={
              FlyNowStore.currentStep === 2
                ? 'process'
                : FlyNowStore.currentStep > 2
                ? 'finish'
                : 'wait'
            }
            title="Fly"
            icon={
              <FontAwesomeIcon
                icon={faPlaneDeparture}
                style={{ marginRight: '8px' }}
              />
            }
          />
          <Step
            status={
              FlyNowStore.currentStep === 3
                ? 'process'
                : FlyNowStore.currentStep > 3
                ? 'finish'
                : 'wait'
            }
            title="Report"
            icon={<SmileOutlined />}
          />
        </Steps>
        <div style={{ marginTop: '16px', marginBottom: '0px' }}>
          {(FlyNowStore.currentStep as number) < 3 ? (
            contents[FlyNowStore.currentStep || 0]
          ) : (
            <Report flightId={FlyNowStore.selectedFlight.id} />
          )}
        </div>
      </div>
    );
  });
}

export default FlyNow;
