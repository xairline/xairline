import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getLogger } from '@xairline/shared-logger';
import { Plane, PlaneApi } from '@xairline/shared-rest-client-remote';
import {
  SupportedAircrafts,
  Rules,
  XPlaneData,
} from '@xairline/shared-xplane-data';
import {
  Button,
  Col,
  Divider,
  PageHeader,
  Row,
  Select,
  Spin,
  Statistic,
  Tooltip,
} from 'antd';

import { runInAction } from 'mobx';
import { useObserver } from 'mobx-react-lite';
import { useEffect } from 'react';
import { remoteConfiguration, useStores } from '../../../store';
import { FlyNowStore } from '../../../store/FlyNowStore';
import Regulations from '../../regulations/regulations';
import Satisfication from '../../satisfication';
import './load.module.css';
const logger = getLogger();
const planeApi = new PlaneApi(remoteConfiguration);
/* eslint-disable-next-line */
export interface LoadProps {
  flyNowStore: FlyNowStore;
}

export function Load(props: LoadProps) {
  const FlyNowStore = props.flyNowStore;
  const { AirlineStore } = useStores();
  let selectedAircraft: string = FlyNowStore.selectedFlight.aircraft;
  useEffect(() => {
    FlyNowStore.getLoadSheet();
  }, []);
  return useObserver(() => {
    return (
      <div style={{ background: '#4f545c' }}>
        <PageHeader
          ghost={false}
          title={FlyNowStore?.selectedFlight?.name}
          subTitle={`${FlyNowStore.selectedFlight?.departure} - ${FlyNowStore.selectedFlight?.arrival}`}
          extra={[
            <Button
              key="1"
              type="primary"
              onClick={async () => {
                // check if lease is required and add that to cost array
                const { data: availablePlanes } =
                  await planeApi.getManyBasePlaneControllerPlane(
                    undefined,
                    undefined,
                    [
                      `status||$eq||normal`,
                      `owned_by||$eq||${AirlineStore.activeAirline?.id}`,
                    ]
                  );
                const planes: Plane[] = (availablePlanes as Plane[]).filter(
                  (plane: Plane) => {
                    return plane.aircraft_type === selectedAircraft;
                  }
                );
                if (planes.length > 0) {
                  FlyNowStore.plane = planes[0];
                  // set that plan to in_flight
                  await planeApi.updateOneBasePlaneControllerPlane(
                    FlyNowStore.plane.id as number,
                    { ...FlyNowStore.plane, status: 'in_flight' }
                  );
                  logger.info('use plane you own');
                }
                runInAction(() => {
                  FlyNowStore.isTracking = false;
                  FlyNowStore.changeStep(2);
                });
              }}
            >
              FLY!
            </Button>,
          ]}
        >
          {FlyNowStore.paxSheet ? (
            <>
              <Row>
                <Statistic
                  title="Passengers"
                  value={FlyNowStore.paxSheet.total_number_of_passengers}
                />
                <Statistic
                  title="Estimated Satification"
                  value={FlyNowStore.paxSheet.satisfication || '---'}
                  precision={2}
                  valueStyle={{ color: '#009988' }}
                  suffix="%"
                  style={{
                    margin: '0 32px',
                  }}
                />
                <Statistic
                  title={
                    <Tooltip title="Revenue and cost are caculated at 50x, or no one would be able to afford any plane">
                      Estimated Revenue
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        style={{ marginLeft: '8px' }}
                        size={'1x'}
                      />
                    </Tooltip>
                  }
                  prefix="$"
                  value={XPlaneData.calcRevenue(
                    FlyNowStore.paxSheet?.total_number_of_passengers || 0,
                    FlyNowStore.selectedFlight?.estimated_flight_time
                  )}
                  style={{
                    margin: '0 32px',
                  }}
                />
                <Statistic
                  title="Estimated Flight Time"
                  suffix="min"
                  value={XPlaneData.dataRoundup(
                    FlyNowStore.selectedFlight?.estimated_flight_time /
                      1000 /
                      60
                  )}
                  style={{
                    margin: '0 32px',
                  }}
                />
                <Statistic
                  value=" "
                  title={
                    <Tooltip title="If you fly an aircraft that you don't own, you are going to be charged for leasing. (B738: 100/min, and 5000/min after 50x simulated)">
                      Assign a plane
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        style={{ marginLeft: '8px' }}
                        size={'1x'}
                      />
                    </Tooltip>
                  }
                  prefix={
                    <Select
                      placeholder="Select a option and change input text above"
                      onChange={(value) => {
                        selectedAircraft = value;
                        runInAction(() => {
                          FlyNowStore.selectedFlight.aircraft = value;
                          FlyNowStore.rules = new Rules(
                            FlyNowStore.selectedFlight.aircraft,
                            FlyNowStore.flightData
                          );
                          FlyNowStore.getLoadSheet(value);
                        });
                      }}
                      showSearch
                      style={{ width: '180px' }}
                      value={FlyNowStore.selectedFlight.aircraft}
                    >
                      {SupportedAircrafts().map((aircraft) => {
                        return (
                          <Select.Option value={aircraft} key={aircraft}>
                            {aircraft}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  }
                  style={{
                    margin: '0 32px',
                  }}
                />
              </Row>
              <Divider />
              <Row>
                <Col span={11}>
                  <Satisfication data={FlyNowStore.paxSheet} />
                </Col>
                <Col span={11} offset={2}>
                  <Regulations data={FlyNowStore.rules} />
                </Col>
              </Row>
            </>
          ) : (
            <Row style={{ marginTop: '10%' }}>
              <Col span={8} offset={8}>
                <Spin
                  size="large"
                  tip="Recieving load sheet from dispatch ..."
                />
              </Col>
            </Row>
          )}
        </PageHeader>
      </div>
    );
  });
}

export default Load;
