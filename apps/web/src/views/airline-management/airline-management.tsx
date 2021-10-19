import { EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { getLogger } from '@xairline/shared-logger';
import {
  AirlineRelationsApi,
  AirlineV2Api as RemoteAirlineApi,
} from '@xairline/shared-rest-client-remote';
import { XPlaneData } from '@xairline/shared-xplane-data';
import { Avatar, Button, Card, Col, PageHeader, Row, Statistic } from 'antd';
import Meta from 'antd/lib/card/Meta';
import faker from 'faker';
import { useObserver } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useStores } from '../../store';
import { remoteConfiguration } from '../../store/constants';
const logger = getLogger();
const remoteAirlieApi = new RemoteAirlineApi(remoteConfiguration);
const airlineRelationsApi = new AirlineRelationsApi(remoteConfiguration);
/* eslint-disable-next-line */
export interface AirlineManagementProps {}

export function AirlineManagement(props: AirlineManagementProps) {
  const { AirlineStore } = useStores();

  useEffect(() => {
    AirlineStore.getAirlineDetails();
  }, []);
  return useObserver(() => {
    return AirlineStore.publicAirlines ? (
      <div
        style={{
          height: '100%',
          maxHeight: '90vh',
          overflowX: 'hidden',
          maxWidth: '99%',
        }}
      >
        <Col span={24}>
          <Row key={2.0} align="top" gutter={[8, 8]}>
            <PageHeader
              ghost={false}
              title={'Airlines'}
              subTitle={`Work for another airline!`}
              style={{ marginBottom: '8px' }}
            >
              <Row>
                <Statistic
                  title="Avaiable Airlines"
                  value={AirlineStore.publicAirlines.length}
                />
                <Statistic
                  title="Total Violations"
                  style={{ marginLeft: '32px' }}
                  value={AirlineStore.publicAirlines.reduce(
                    (pv, cv) => pv + parseFloat(`${cv.total_violations}`),
                    0.0
                  )}
                />
                <Statistic
                  title="Total landings"
                  style={{ marginLeft: '32px' }}
                  value={AirlineStore.publicAirlines.reduce(
                    (pv, cv) => pv + cv.total_flights,
                    0
                  )}
                />
                <Statistic
                  title="Total Hours"
                  style={{ marginLeft: '32px' }}
                  value={XPlaneData.dataRoundup(
                    AirlineStore.publicAirlines.reduce(
                      (pv, cv) => pv + parseFloat(`${cv.total_hours}`),
                      0.0
                    )
                  )}
                />
                <Statistic
                  title="Total Book Value"
                  style={{ marginLeft: '32px' }}
                  value={XPlaneData.dataRoundup(
                    AirlineStore.publicAirlines.reduce(
                      (pv, cv) => pv + parseFloat(`${cv.cash}`),
                      0.0
                    )
                  )}
                />
              </Row>
            </PageHeader>
          </Row>
          <Row key={2.1} align="top" gutter={[8, 8]}>
            {AirlineStore.publicAirlines.map((airline) => {
              return (
                <Card
                  style={{
                    width: 250,
                    marginBottom: '4px',
                    marginRight: '4px',
                  }}
                  actions={[
                    <Button
                      onClick={async () => {
                        if (AirlineStore.isOwner) {
                          await airlineRelationsApi.createOneBaseAirlineRelationsControllerAirlineToAirlineRelation(
                            {
                              owner_id: airline.id as string,
                              pilot_id: AirlineStore.activeAirline
                                ?.id as string,
                              status: 'pending',
                            }
                          );
                          alert(`Applied: ${airline.name}`);
                          await AirlineStore.getAirlineDetails();
                        } else {
                          alert(
                            'You have to switch back to your own airline first.'
                          );
                        }
                      }}
                      type={'primary'}
                    >
                      <SettingOutlined
                        key="setting"
                        style={{ marginRight: '8px' }}
                      />
                      Apply
                    </Button>,
                  ]}
                >
                  <Meta
                    avatar={
                      <Avatar
                        size="large"
                        src={
                          airline.profilePic ||
                          faker.image.imageUrl(128, 128, 'animals', true)
                        }
                      />
                    }
                    title={airline.name}
                    description={
                      <>
                        <Row>Callsign: {airline.callsign}</Row>
                        <Row>Total Flights: {airline.total_flights}</Row>
                        <Row>
                          Total Hours:{' '}
                          {XPlaneData.dataRoundup(airline.total_hours)}
                        </Row>
                        <Row>
                          Balance:{' '}
                          {airline.cash > 1000000000
                            ? XPlaneData.dataRoundup(
                                airline.cash / 1000000000
                              ) + 'B'
                            : airline.cash > 1000000
                            ? XPlaneData.dataRoundup(airline.cash / 1000000) +
                              'M'
                            : airline.cash > 1000
                            ? XPlaneData.dataRoundup(airline.cash / 1000) + 'K'
                            : airline.cash}
                        </Row>
                      </>
                    }
                  />
                </Card>
              );
            })}
          </Row>
        </Col>
      </div>
    ) : (
      <h1>Loading ...</h1>
    );
  });
}

export default AirlineManagement;
