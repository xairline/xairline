import { Rules } from '@xairline/shared-xplane-data';
import { Badge, Collapse, List } from 'antd';
import { RuleProperties } from 'json-rules-engine';
import './regulations.module.css';
const { Panel } = Collapse;

/* eslint-disable-next-line */
export interface RegulationsProps {
  data: Rules;
}

export function Regulations(props: RegulationsProps) {
  return (
    <div>
      <h2> XAA Safety Regulations</h2>
      <Collapse expandIconPosition="right" accordion={false}>
        <Panel
          key="Taxi"
          header={
            <Badge count={props.data.rules.taxiRules?.length} offset={[40, 5]}>
              Taxi
            </Badge>
          }
        >
          <List
            dataSource={props.data.rules.taxiRules?.map(
              (rule: RuleProperties) => {
                return rule.event?.params?.event;
              }
            )}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Panel>
        <Panel
          key="Takeoff"
          header={
            <Badge
              count={props.data.rules.takeoffRules?.length}
              offset={[40, 5]}
            >
              Takeoff
            </Badge>
          }
        >
          <List
            dataSource={props.data.rules.takeoffRules?.map(
              (rule: RuleProperties) => {
                return rule.event?.params?.event;
              }
            )}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Panel>
        <Panel
          key="Climb"
          header={
            <Badge count={props.data.rules.climbRules?.length} offset={[40, 5]}>
              Climb
            </Badge>
          }
        >
          <List
            dataSource={props.data.rules.climbRules?.map(
              (rule: RuleProperties) => {
                return rule.event?.params?.event;
              }
            )}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Panel>
        <Panel
          key="Cruise"
          header={
            <Badge
              count={props.data.rules.cruiseRules?.length}
              offset={[40, 5]}
            >
              Cruise
            </Badge>
          }
        >
          <List
            dataSource={props.data.rules.cruiseRules?.map(
              (rule: RuleProperties) => {
                return rule.event?.params?.event;
              }
            )}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Panel>
        <Panel
          key="Descend"
          header={
            <Badge
              count={props.data.rules.descendRules?.length}
              offset={[40, 5]}
            >
              Descend
            </Badge>
          }
        >
          <List
            dataSource={props.data.rules.descendRules?.map(
              (rule: RuleProperties) => {
                return rule.event?.params?.event;
              }
            )}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Panel>
        <Panel
          key="Landing"
          header={
            <Badge
              count={props.data.rules.landingRules?.length}
              offset={[40, 5]}
            >
              Landing
            </Badge>
          }
        >
          <List
            dataSource={props.data.rules.landingRules?.map(
              (rule: RuleProperties) => {
                return rule.event?.params?.event;
              }
            )}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Panel>
      </Collapse>
    </div>
  );
}

export default Regulations;
