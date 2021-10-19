import { Col, Collapse, Row, Statistic } from 'antd';
import { useObserver } from 'mobx-react-lite';
import { Passenger } from '@xairline/shared-rest-client-remote';
import './index.module.css';
const { Panel } = Collapse;

/* eslint-disable-next-line */
export interface SatisficationProps {
  data: Passenger;
}

export function Satisfication(props: SatisficationProps) {
  return useObserver(() => {
    return (
      <div>
        <h2> Passenger Satisfication Overview</h2>
        <Collapse expandIconPosition="right" accordion={false}>
          <Panel key="Delay" header="Delay">
            <Row>
              <Col span={8}>
                <Statistic
                  title="less than 20min"
                  value={props.data.delayed_flight_penalty_20}
                  valueStyle={{ color: '#3f8600' }}
                  precision={2}
                  suffix="%"
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="20 to 60min"
                  value={props.data.delayed_flight_penalty_60}
                  valueStyle={{ color: '#d4b106' }}
                  precision={2}
                  suffix="%"
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="more than 60"
                  value={props.data.delayed_flight_penalty_120}
                  valueStyle={{ color: '#cf1322' }}
                  precision={2}
                  suffix="%"
                />
              </Col>
            </Row>
          </Panel>
          <Panel key="Langding G Force" header="Langding G Force">
            <Row>
              <Col span={8}>
                <Statistic
                  title="less than 1.5G"
                  value={props.data.landing_g_force_penalty_1_5}
                  valueStyle={{ color: '#3f8600' }}
                  precision={2}
                  suffix="%"
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="1.5 to 2G"
                  value={props.data.landing_g_force_penalty_2_0}
                  valueStyle={{ color: '#d4b106' }}
                  precision={2}
                  suffix="%"
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="more than 2G"
                  value={props.data.landing_g_force_penalty_2_5}
                  valueStyle={{ color: '#cf1322' }}
                  precision={2}
                  suffix="%"
                />
              </Col>
            </Row>
          </Panel>
          <Panel key="Vertical Speed" header="Langding VS">
            <Row>
              <Col span={8}>
                <Statistic
                  title="less than 150ft/min"
                  value={props.data.landing_vs_penalty_1_5}
                  valueStyle={{ color: '#3f8600' }}
                  precision={2}
                  suffix="%"
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="150 to 250ft/min"
                  value={props.data.landing_vs_penalty_2_5}
                  valueStyle={{ color: '#d4b106' }}
                  precision={2}
                  suffix="%"
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="more than 250/min"
                  value={props.data.landing_vs_penalty_3_0}
                  valueStyle={{ color: '#cf1322' }}
                  precision={2}
                  suffix="%"
                />
              </Col>
            </Row>
          </Panel>
        </Collapse>
      </div>
    );
  });
}

export default Satisfication;
