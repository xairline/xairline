import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { XPlaneData } from '@xairline/shared-xplane-data';
import { Avatar, Card, Col, List, Row, Spin, Tooltip } from 'antd';
import faker from 'faker';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useObserver } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import ReactMapboxGl, { Image } from 'react-mapbox-gl';
import { useStores } from '../../store';
import { Livemap } from '../livemap/livemap';
import './home.module.css';
/* eslint-disable-next-line */
export interface HomeProps {}

function LiveFlights() {
  const { LivemapStore } = useStores();
  return useObserver(() => {
    return (
      <List
        dataSource={LivemapStore.planes}
        renderItem={(plane) => {
          const flightData = JSON.parse(plane.flight_data as string);
          const tooltipTitle = (
            <List size="small" style={{ width: '100%' }}>
              <List.Item key="flightNum">{plane.flight_number}</List.Item>
              <List.Item key="route">{plane.route}</List.Item>
              <List.Item key="lat">Latitude: {plane.latitude}</List.Item>
              <List.Item key="lng">Longitude: {plane.longitude}</List.Item>
              <List.Item key="gs">
                GS: {XPlaneData.dataRoundup(flightData?.gs * 1.94384) || '--'}{' '}
                Knots
              </List.Item>
              <List.Item key="ias">
                IAS: {XPlaneData.dataRoundup(flightData?.ias) || '--'} Knots
              </List.Item>
              <List.Item key="elevation">
                ELEVATION:{' '}
                {XPlaneData.dataRoundup(flightData?.elevation * 3.28) || '--'}{' '}
                ft
              </List.Item>
              <List.Item key="vs">
                VS: {XPlaneData.dataRoundup(flightData?.vs * 196.85) || '--'}{' '}
                ft/min
              </List.Item>
            </List>
          );
          return (
            <List.Item
              onClick={() => {
                //TODO
              }}
              key={plane.id}
            >
              <List.Item.Meta title={plane.flight_number} />
              <Tooltip title={tooltipTitle} placement="left">
                {plane.route}
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  style={{ marginLeft: '8px' }}
                  size={'1x'}
                />
              </Tooltip>
            </List.Item>
          );
        }}
      />
    );
  });
}

export function Home(props: HomeProps) {
  const { AirlineStore, FleetStore } = useStores();
  const [mapControl, setMapControl] = useState({
    coordinates: [-75.695, 45.424721],
    zoom: 4,
  });
  useEffect(() => {
    FleetStore.loadFleet(AirlineStore?.activeAirline?.id as string);
  }, []);
  return useObserver(() => {
    let totalFlights = 0;
    let totalViolations = 0;
    let totalBookValue = 0;
    if (AirlineStore.ladderData && AirlineStore.ladderData?.length !== 0) {
      AirlineStore.ladderData.forEach((item) => {
        totalFlights += item.total_flights;
        totalViolations += item.total_violations || 0;
        if (item.name !== 'XAA') {
          totalBookValue =
            parseFloat(`${totalBookValue}`) + parseFloat(`${item.cash}`);
        }
      });
    }
    let landingSorted: any[] | undefined = [];
    if (AirlineStore.ladderData && AirlineStore.ladderData?.length !== 0) {
      landingSorted = AirlineStore?.ladderData
        .slice()
        .filter((data) => data.landing_g > 1)
        .sort((a, b) => a.landing_g - b.landing_g)
        .slice(0, 5);
    }

    let cashSorted: any[] | undefined = [];
    if (AirlineStore.ladderData && AirlineStore.ladderData?.length !== 0) {
      cashSorted = AirlineStore?.ladderData
        .slice()
        .sort((a, b) => b.cash - a.cash)
        .slice(0, 5);
    }
    const Map = ReactMapboxGl({
      accessToken:
        'pk.eyJ1IjoieGFpcmxpbmUiLCJhIjoiY2t1OGg4YmlkNXZldzJvcG1ud3JwcDc0YiJ9.xLXSPf-vg2YZyjmIykUX-g',
    });

    return AirlineStore.isLoaded ? (
      <div>
        <Col span={24}>
          <Row gutter={[8, 8]} style={{ width: '100%', height: '58vh' }}>
            <Col span={18}>
              <Map
                style="mapbox://styles/mapbox/dark-v10"
                containerStyle={{
                  height: '98%',
                  width: '100%',
                }}
                center={mapControl.coordinates as [number, number]}
                zoom={[mapControl.zoom]}
              >
                <Image
                  id={'xairline'}
                  url={'https://xairline.org/images/logo.png'}
                />
                <Livemap mapControl={setMapControl} />
              </Map>
            </Col>
            <Col span={6}>
              <Card
                style={{ width: '100%', height: '99%' }}
                title={
                  <strong style={{ color: '#6d9eeb' }}>Live Flights</strong>
                }
                size="small"
              >
                <LiveFlights />
              </Card>
            </Col>
          </Row>
          <Row gutter={[8, 8]} style={{ width: '100%' }}>
            <Col span={9}>
              <Card
                style={{ width: '100%' }}
                title="Top 5 Airline - Landing (last 7 days)"
                size="small"
              >
                <List
                  dataSource={landingSorted}
                  renderItem={(item) => {
                    return (
                      <List.Item>
                        <List.Item.Meta
                          title={item.name}
                          avatar={
                            <Avatar
                              src={
                                item.profilePic ||
                                faker.image.imageUrl(128, 128, 'animals', true)
                              }
                            />
                          }
                        />
                        <div>
                          {XPlaneData.dataRoundup(item.landing_g)}G |{' '}
                          {XPlaneData.dataRoundup(item.landing_vs)}ft/min
                        </div>
                      </List.Item>
                    );
                  }}
                />
              </Card>
            </Col>
            <Col span={9}>
              <Card
                style={{ width: '100%' }}
                title="Top 5 Airline - Book Value (last 7 days)"
                size="small"
              >
                <List
                  dataSource={cashSorted}
                  renderItem={(item) => {
                    return (
                      <List.Item>
                        <List.Item.Meta
                          title={item.name}
                          avatar={
                            <Avatar
                              src={
                                item.profilePic ||
                                faker.image.imageUrl(128, 128, 'animals', true)
                              }
                            />
                          }
                        />
                        <div>
                          {item.cash > 1000000000
                            ? XPlaneData.dataRoundup(item.cash / 1000000000) +
                              'B'
                            : item.cash > 1000000
                            ? XPlaneData.dataRoundup(item.cash / 1000000) + 'M'
                            : item.cash > 1000
                            ? XPlaneData.dataRoundup(item.cash / 1000) + 'K'
                            : item.cash}
                        </div>
                      </List.Item>
                    );
                  }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card
                style={{ width: '100%' }}
                title="X Airline Stats"
                size="small"
              >
                <List>
                  <List.Item>
                    <List.Item.Meta title="Total Airlines:" />
                    <div>{AirlineStore.ladderData?.length}</div>
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta title="Total Flights:" />
                    <div>{totalFlights}</div>
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta title="Total Violations:" />
                    <div>{totalViolations}</div>
                  </List.Item>
                  <List.Item>
                    <List.Item.Meta title="Planes on sale:" />
                    <div>{FleetStore?.listedPlanes?.length || 0}</div>
                  </List.Item>
                </List>
              </Card>
            </Col>
          </Row>
        </Col>
      </div>
    ) : (
      <Spin size="large" tip="I am trying..."></Spin>
    );
  });
}

export default Home;
