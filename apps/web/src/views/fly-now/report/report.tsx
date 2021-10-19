import { DualAxes } from '@ant-design/charts';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LandingData, XPlaneData } from '@xairline/shared-xplane-data';
import {
  Button,
  Col,
  Collapse,
  Divider,
  List,
  PageHeader,
  Row,
  Space,
  Spin,
  Statistic,
  Timeline,
  Tooltip,
} from 'antd';
import { useObserver } from 'mobx-react-lite';
import { useStores } from '../../../store';
import './report.module.css';
const { Panel } = Collapse;
/* eslint-disable-next-line */
export interface ReportProps {
  flightId: number;
}

export function Report(props: ReportProps) {
  const flightId = props.flightId;
  const { ReportStore, FlyNowStore } = useStores();
  ReportStore.loadReport(flightId);
  return useObserver(() => {
    if (!ReportStore.isLoaded) {
      return (
        <Space size="middle">
          <Spin size="large" />
        </Space>
      );
    }
    const mylandingData: LandingData = JSON.parse(
      ReportStore.report.landingData
    );
    let touchDownTs = 0;
    let index = 0;
    let touchDownCounter = -1;
    const mydata: any[] = [];
    const mydataTransformed: any[] = [];
    mylandingData.data.forEach((data: any) => {
      if (touchDownCounter === 0) {
        return;
      } else {
        touchDownCounter--;
      }
      if (
        Math.round(data.vs * 196.85 * 100) ===
        Math.round(mylandingData.vs * 100)
      ) {
        touchDownTs = index;
        touchDownCounter = 100;
      }
      data.vs = Math.round(data.vs * 196.85 * 100) / 100;
      data.agl = Math.round(data.agl * 3.28084 * 100) / 100;
      data.ts = new Date(data.ts).toISOString();
      if (data.agl < 50) {
        mydata.push(data);
        mydataTransformed.push({
          ts: data.ts,
          name: 'agl',
          value: data.agl,
        });
        mydataTransformed.push({
          ts: data.ts,
          name: 'pitch',
          value: XPlaneData.dataRoundup(data.pitch),
        });
        mydataTransformed.push({
          ts: data.ts,
          name: 'ias',
          value: XPlaneData.dataRoundup(data.ias),
        });
      }
      index++;
    });
    const config = {
      data: [mydata, mydataTransformed],
      xField: 'ts',
      yField: ['vs', 'value'],
      geometryOptions: [
        {
          geometry: 'line',
        },
        {
          geometry: 'line',
          seriesField: 'name',
        },
      ],
      height: 250,
      annotations: [
        [
          {
            type: 'text',
            position: { ts: mylandingData.data[touchDownTs].ts, vs: 'max' },
            content: 'touch down',
            offsetY: -16,
          },
          {
            type: 'region',
            top: true,
            start: { ts: mylandingData.data[touchDownTs].ts, vs: 'min' },
            end: { ts: mylandingData.data[touchDownTs + 1].ts, vs: 'max' },
            style: {
              stroke: '#F4664A',
              lineWidth: 2,
              fill: 'red',
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
    const expectedRevenue = XPlaneData.calcRevenue(
      ReportStore.passengerReport.total_number_of_passengers || 0,
      ReportStore.flight?.estimated_flight_time || 0,
      ReportStore.passengerReport.satisfication || 0
    );
    const costs: any[] = JSON.parse(ReportStore.report.cost);
    let actualRevenue = expectedRevenue;
    costs.forEach((cost) => {
      actualRevenue -= XPlaneData.dataRoundup(cost.cost);
    });
    return (
      <div>
        <PageHeader
          ghost={false}
          title={ReportStore.flight.name}
          extra={
            FlyNowStore.currentStep === 3
              ? [
                  <Button
                    key="2"
                    type="primary"
                    onClick={() => {
                      FlyNowStore.init();
                      if (FlyNowStore.ws) {
                        FlyNowStore.ws.close();
                      }
                      FlyNowStore.changeStep(0);
                    }}
                  >
                    New Flight
                  </Button>,
                ]
              : []
          }
          subTitle={`${ReportStore.flight.departure} - ${ReportStore.flight.arrival}`}
        >
          <Row>
            <Col span={15}>
              <Row>
                <Statistic
                  title="Passengers"
                  value={ReportStore.passengerReport.total_number_of_passengers}
                />

                <Statistic
                  title={
                    <Tooltip title="Revenue and cost are caculated at 50x, or no one would be able to afford any plane">
                      Revenue
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        style={{ marginLeft: '8px' }}
                        size={'1x'}
                      />
                    </Tooltip>
                  }
                  prefix="$"
                  value={XPlaneData.dataRoundup(actualRevenue)}
                  style={{
                    margin: '0 16px',
                  }}
                />
                <Statistic
                  title="Actual Flight Time"
                  suffix="min"
                  value={XPlaneData.dataRoundup(
                    (ReportStore.flight?.actual_flight_time || 0) / 1000 / 60
                  )}
                  style={{
                    margin: '0 16px',
                  }}
                />
                <Statistic
                  title="Estimated Flight Time"
                  suffix="min"
                  value={XPlaneData.dataRoundup(
                    (ReportStore.flight?.estimated_flight_time || 0) / 1000 / 60
                  )}
                  style={{
                    margin: '0 16px',
                  }}
                />
              </Row>
              <Divider />
              <Collapse expandIconPosition="right" accordion={false}>
                <Panel
                  header={
                    <Row>
                      <Col span={12}>
                        <Statistic
                          title="Langding G Force"
                          value={mylandingData.gForce}
                          precision={2}
                          valueStyle={
                            mylandingData.gForce < 1.5
                              ? { color: '#3f8600' }
                              : mylandingData.gForce < 2.5
                              ? { color: '#d4b106' }
                              : { color: '#cf1322' }
                          }
                          suffix="G"
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic
                          title="Langding VS"
                          value={mylandingData.vs || '--'}
                          precision={2}
                          valueStyle={
                            mylandingData.vs * -1 < 100
                              ? { color: '#3f8600' }
                              : mylandingData.vs * -1 < 250
                              ? { color: '#d4b106' }
                              : { color: '#cf1322' }
                          }
                          suffix="ft/min"
                        />
                      </Col>
                    </Row>
                  }
                  key="0"
                >
                  <DualAxes {...config} />
                </Panel>
                <Panel
                  header={
                    <Statistic
                      title="Passenger Satisfication"
                      value={ReportStore.passengerReport.satisfication}
                      precision={2}
                      valueStyle={
                        (ReportStore?.passengerReport?.satisfication || 0) >=
                        100
                          ? { color: '#3f8600' }
                          : { color: '#cf1322' }
                      }
                      suffix="%"
                    />
                  }
                  key="1"
                >
                  <List>
                    <List.Item>
                      <List.Item.Meta
                        title="Delay"
                        description={`
                          ${
                            (ReportStore.flight?.actual_flight_time || 0) /
                              1000 /
                              60 -
                              (ReportStore.flight?.estimated_flight_time || 0) /
                                1000 /
                                60 <
                            20
                              ? ReportStore.passengerReport
                                  .delayed_flight_penalty_20
                              : (ReportStore.flight?.actual_flight_time || 0) /
                                  1000 /
                                  60 -
                                  (ReportStore.flight?.estimated_flight_time ||
                                    0) /
                                    1000 /
                                    60 <
                                60
                              ? ReportStore.passengerReport
                                  .delayed_flight_penalty_60
                              : ReportStore.passengerReport
                                  .delayed_flight_penalty_120
                          }
                        %`}
                      />
                    </List.Item>
                    <List.Item>
                      <List.Item.Meta
                        title="Landing G Force"
                        description={`
                          ${
                            mylandingData.gForce < 1.5
                              ? ReportStore.passengerReport
                                  .landing_g_force_penalty_1_5
                              : mylandingData.gForce < 2
                              ? ReportStore.passengerReport
                                  .landing_g_force_penalty_2_0
                              : ReportStore.passengerReport
                                  .landing_g_force_penalty_2_5
                          }
                        %`}
                      />
                    </List.Item>
                    <List.Item>
                      <List.Item.Meta
                        title="Landing Vertical Speed"
                        description={`
                          ${
                            mylandingData.vs * -1 < 150
                              ? ReportStore.passengerReport
                                  .landing_vs_penalty_1_5
                              : mylandingData.vs * -1 < 250
                              ? ReportStore.passengerReport
                                  .landing_vs_penalty_2_5
                              : ReportStore.passengerReport
                                  .landing_vs_penalty_3_0
                          }
                        %`}
                      />
                    </List.Item>
                  </List>
                </Panel>
                <Panel
                  header={<h3>XAA Safety Regulation Violations</h3>}
                  key="2"
                >
                  {JSON.parse(ReportStore.report.violation_events).map(
                    (event: string) => (
                      <Timeline.Item key={event}>{event}</Timeline.Item>
                    )
                  )}
                </Panel>
                <Panel header={<h3>Financial Report</h3>} key="3">
                  <List
                    dataSource={costs}
                    renderItem={(item) => {
                      return (
                        <List.Item>
                          <List.Item.Meta title={item.name} />
                          <div>-{XPlaneData.dataRoundup(item.cost)}</div>
                        </List.Item>
                      );
                    }}
                  >
                    <Divider />
                    <List.Item>
                      <List.Item.Meta title="Gross Revenue" />
                      <div>{XPlaneData.dataRoundup(expectedRevenue)}</div>
                    </List.Item>

                    <List.Item>
                      <List.Item.Meta title="Profit" />
                      <div>{XPlaneData.dataRoundup(actualRevenue)}</div>
                    </List.Item>
                  </List>
                </Panel>
              </Collapse>
            </Col>
            <Col span={8} offset={1}>
              <Timeline pending={false}>
                {JSON.parse(ReportStore.report.events).map((event: string) => (
                  <Timeline.Item key={event}>{event}</Timeline.Item>
                ))}
              </Timeline>
            </Col>
          </Row>
        </PageHeader>
      </div>
    );
  });
}

export default Report;
