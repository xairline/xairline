import {
  Button,
  Col,
  Divider,
  PageHeader,
  Popconfirm,
  Row,
  Timeline,
} from 'antd';
import { PlaneApi } from '@xairline/shared-rest-client-remote';
import { useObserver } from 'mobx-react-lite';
import { useEffect } from 'react';
import { remoteConfiguration, useStores } from '../../../store';
import './fly.module.css';
const planeApi = new PlaneApi(remoteConfiguration);
/* eslint-disable-next-line */
export interface FlyProps {}

export function Fly(props: FlyProps) {
  const { FlyNowStore } = useStores();
  useEffect(() => {
    FlyNowStore.trackingFlight();
  }, []);
  return useObserver(() => {
    return (
      <div style={{ background: '#4f545c' }}>
        <PageHeader
          ghost={false}
          title={FlyNowStore?.selectedFlight?.name}
          subTitle={`${FlyNowStore.selectedFlight?.departure} - ${FlyNowStore.selectedFlight?.arrival}`}
          extra={[
            <Popconfirm
              title="Are sure you want to cancel the flight?"
              onConfirm={async () => {
                if (FlyNowStore.plane) {
                  await planeApi.updateOneBasePlaneControllerPlane(
                    FlyNowStore.plane.id as number,
                    { ...FlyNowStore.plane, status: 'normal' }
                  );
                }
                FlyNowStore.init();
                if (FlyNowStore.ws) {
                  FlyNowStore.ws.close();
                }
                FlyNowStore.changeStep(0);
              }}
              onVisibleChange={() => console.log('visible change')}
            >
              <Button danger key="2" type="primary" color="red">
                Cancel Flight
              </Button>
            </Popconfirm>,
          ]}
        ></PageHeader>
        <Divider />
        <Row>
          <Col span={8} offset={1}>
            <h4>XAA Safety Violations</h4>
            <Timeline>
              {FlyNowStore?.flightData?.violationEvents.map((event: string) => (
                <Timeline.Item
                  key={event}
                  // color={item.finshed ? 'green' : '#eee'}
                >
                  {event}
                </Timeline.Item>
              ))}
            </Timeline>
          </Col>
          <Col span={12} offset={3}>
            <h4>Timeline</h4>
            <Timeline
              pending={!FlyNowStore.isTracking ? 'Connecting ...' : false}
            >
              {FlyNowStore?.flightData?.events.map((event: string) => (
                <Timeline.Item
                  key={event}
                  // color={item.finshed ? 'green' : '#eee'}
                >
                  {event}
                </Timeline.Item>
              ))}
            </Timeline>
          </Col>
        </Row>
      </div>
    );
  });
}

export default Fly;
