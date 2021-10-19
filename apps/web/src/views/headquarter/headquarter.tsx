import { Card, Col, Descriptions, List, Row, Spin, Statistic } from 'antd';
import { useStores } from '../../store';
import { useObserver } from 'mobx-react-lite';
import { Bar, DualAxes } from '@ant-design/charts';
import { valueType } from 'antd/lib/statistic/utils';
import { XPlaneData } from '@xairline/shared-xplane-data';

/* eslint-disable-next-line */
export interface HeadquarterProps {}

export function Headquarter(props: HeadquarterProps) {
  const { AirlineStore } = useStores();
  return useObserver(() => {
    const landingConfig = {
      data: [
        AirlineStore.flightReportSummary,
        AirlineStore.flightReportSummary,
      ],
      xField: 'lastUpdate',
      yField: ['landingGForce', 'landingVS'],
      geometryOptions: [
        {
          geometry: 'line',
        },
        {
          geometry: 'line',
        },
      ],
      height: 250,
      annotations: [
        [
          {
            type: 'text',
            position: { lastUpdate: 'min', landingGForce: 'mean' },
            content: 'Avg G Force',
            offsetY: -8,
          },
          {
            type: 'line',
            start: { lastUpdate: 'min', landingGForce: 'mean' },
            end: { lastUpdate: 'max', landingGForce: 'mean' },
            style: {
              stroke: '#F4664A',
              lineWidth: 2,
              fill: 'red',
            },
          },
        ],
        [
          {
            type: 'text',
            position: { lastUpdate: 'max', landingVS: 'mean' },
            content: 'Avg VS',
            offsetY: 8,
          },
          {
            type: 'line',
            start: { lastUpdate: 'min', landingVS: 'mean' },
            end: { lastUpdate: 'max', landingVS: 'mean' },
            style: {
              stroke: '#27AE60',
              lineDash: [2, 2],
            },
          },
        ],
      ],
      smooth: true,
      animation: {
        appear: {
          animation: 'path-in',
          duration: 5000,
        },
      },
    };
    const myData: any = {};
    AirlineStore.flightReportSummary.map((flightReportSummary) => {
      const violations = JSON.parse(flightReportSummary.violations);
      violations.forEach((violation: string) => {
        const event = violation.split(' - ')[1];
        if (myData[event] !== undefined) {
          myData[event] += 1;
        } else {
          myData[event] = 1;
        }
      });
    });
    const violationData: any[] = [];
    Object.keys(myData).forEach((key) => {
      violationData.push({ type: key, count: myData[key] });
    });
    const violationConfig = {
      data: violationData,
      xField: 'count',
      yField: 'type',
      seriesField: 'type',
      height: 250,
      legend: false,
      barBackground: { style: { fill: 'rgba(0,0,0,0.1)' } },
      interactions: [
        {
          type: 'active-region',
          enable: false,
        },
      ],
    };
    let totalFlights = 0;
    let totalViolations = 0;
    if (AirlineStore.ladderData && AirlineStore.ladderData?.length !== 0) {
      AirlineStore.ladderData.forEach((item) => {
        totalFlights += item.total_flights;
        totalViolations += item.total_violations || 0;
      });
    }
    let landingSorted: any[] | undefined = [];
    if (AirlineStore.ladderData && AirlineStore.ladderData?.length !== 0) {
      landingSorted = AirlineStore?.ladderData
        .slice()
        .sort((a, b) => a.landing_g - b.landing_g);
    }

    let flightsSorted: any[] | undefined = [];
    if (AirlineStore.ladderData && AirlineStore.ladderData?.length !== 0) {
      flightsSorted = AirlineStore?.ladderData
        .slice()
        .sort((a, b) => b.total_flights - a.total_flights);
    }

    return AirlineStore.isLoaded ? (
      <div>
        <Row gutter={[8, 8]} style={{ width: '100%' }}>
          <Row gutter={[8, 8]} style={{ width: '100%' }}>
            <Col style={{ width: '100%' }}>
              <Card
                title="Overview"
                style={{ width: '100%', minWidth: '200px' }}
              >
                <Row>
                  <Col flex="1 0 10%">
                    <Card style={{ height: '100px', minWidth: '100px' }}>
                      <Statistic
                        title="Last Flight"
                        value={AirlineStore.lastFlight?.name || '---'}
                        valueStyle={{ color: '#3f8600' }}
                      />
                    </Card>
                  </Col>

                  <Col flex="1 0 10%">
                    <Card style={{ height: '100px', minWidth: '100px' }}>
                      <Statistic
                        title="Hours Flown"
                        value={AirlineStore.hoursFlew}
                        formatter={(value) => {
                          let res = 0;
                          if (value > 1000) {
                            res = XPlaneData.dataRoundup(
                              (value as number) / 1000
                            );
                            return `${res} K`;
                          }
                          return XPlaneData.dataRoundup(value as number);
                        }}
                        precision={2}
                        valueStyle={{ color: '#009988' }}
                        suffix="Hours"
                      />
                    </Card>
                  </Col>
                  <Col flex="1 0 10%">
                    <Card style={{ height: '100px', minWidth: '100px' }}>
                      <Statistic
                        title="Total Flights"
                        value={AirlineStore.totalFlights}
                        formatter={(value) => {
                          let res = 0;
                          if (value > 1000) {
                            res = XPlaneData.dataRoundup(
                              (value as number) / 1000
                            );
                            return `${res} K`;
                          }
                          return XPlaneData.dataRoundup(value as number);
                        }}
                        precision={0}
                        valueStyle={{ color: '#009988' }}
                        suffix=""
                      />
                    </Card>
                  </Col>
                  <Col flex="1 0 10%">
                    <Card style={{ height: '100px', minWidth: '100px' }}>
                      <Statistic
                        title="Satification"
                        value={AirlineStore.satisfication || '---'}
                        precision={2}
                        valueStyle={{ color: '#009988' }}
                        suffix="%"
                      />
                    </Card>
                  </Col>
                  <Col flex="1 0 10%">
                    <Card style={{ height: '100px', minWidth: '200px' }}>
                      <Statistic
                        title="Bank Account"
                        value={AirlineStore?.activeAirline?.cash || 0}
                        formatter={(value) => {
                          let res = 0;
                          if (value > 1000000000) {
                            res = XPlaneData.dataRoundup(
                              (value as number) / 1000000000
                            );
                            return `${res} B`;
                          }
                          if (value > 1000000) {
                            res = XPlaneData.dataRoundup(
                              (value as number) / 1000000
                            );
                            return `${res} M`;
                          }
                          if (value > 1000) {
                            res = XPlaneData.dataRoundup(
                              (value as number) / 1000
                            );
                            return `${res} K`;
                          }
                          return XPlaneData.dataRoundup(value as number);
                        }}
                        precision={2}
                        valueStyle={{ color: '#009988' }}
                        prefix="$"
                      />
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Row gutter={[8, 8]} style={{ width: '100%' }}>
            <Col span={12}>
              <Card style={{ width: '100%' }} title="Landing">
                <DualAxes {...landingConfig} />
              </Card>
            </Col>
            <Col span={12}>
              <Card style={{ width: '100%' }} title="XAA Violation">
                <Bar {...violationConfig} />
              </Card>
            </Col>
          </Row>
        </Row>
      </div>
    ) : (
      <Spin size="large" tip="I am trying..."></Spin>
    );
  });
}

export default Headquarter;
