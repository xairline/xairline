import { getLogger } from '@xairline/shared-logger';
import {
  AirlineRelationsApi,
  Plane,
} from '@xairline/shared-rest-client-remote';
import { getSupportedAircrafts } from '@xairline/shared-xplane-data';
import { Button, Col, Popconfirm, Row, Table } from 'antd';
import { useObserver } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useStores } from '../../store';
import { remoteConfiguration } from '../../store/constants';
import Airlines from '../airlines/airlines';
const logger = getLogger();
const airlineRelationsApi = new AirlineRelationsApi(remoteConfiguration);

/* eslint-disable-next-line */
export interface PilotsProps {}

export function Pilots(props: PilotsProps) {
  const { AirlineStore } = useStores();
  const airlineId = AirlineStore.activeAirline?.id as string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  const PILOTS_COLUMNS: any[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      filterSearch: true,
      filters: getSupportedAircrafts().map((aircraft) => {
        return { text: aircraft, value: aircraft };
      }),
      onFilter: (value: any, record: Plane) =>
        record.aircraft_type.indexOf(value) === 0,
    },
    {
      title: 'Landing G',
      dataIndex: 'landing_g',
      key: 'landing_g',
      sorter: (a: any, b: any) => a.landing_g - b.landing_g,
    },
    {
      title: 'Landing VS',
      dataIndex: 'landing_vs',
      key: 'landing_vs',
      sorter: (a: any, b: any) => a.landing_vs - b.landing_vs,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a: any, b: any) => a.status - b.status,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        <Row>
          <Col span={3}>
            <Popconfirm
              title={`Are sure you want to approve ${record.name}?`}
              disabled={record.status === 'approved' || !AirlineStore.isOwner}
              onConfirm={async () => {
                await airlineRelationsApi.updateOneBaseAirlineRelationsControllerAirlineToAirlineRelation(
                  record.relationId,
                  {
                    owner_id: AirlineStore.activeAirline?.id as string,
                    pilot_id: record.id,
                    status: 'approved',
                  }
                );
                AirlineStore.getAirlineDetails();
              }}
            >
              <Button
                type="primary"
                disabled={record.status === 'approved' || !AirlineStore.isOwner}
              >
                Approve
              </Button>
            </Popconfirm>
          </Col>
          <Col span={3} offset={5}>
            <Popconfirm
              title={`Are sure you want to remove ${record.name}?`}
              disabled={
                record.status === 'pending' ||
                record.id === AirlineStore?.activeAirline?.id ||
                !AirlineStore.isOwner
              }
              onConfirm={async () => {
                await airlineRelationsApi.deleteOneBaseAirlineRelationsControllerAirlineToAirlineRelation(
                  record.relationId
                );
                AirlineStore.getAirlineDetails();
              }}
            >
              <Button
                danger
                type="primary"
                disabled={
                  record.status === 'pending' ||
                  record.id === AirlineStore?.activeAirline?.id ||
                  !AirlineStore.isOwner
                }
              >
                Delete
              </Button>
            </Popconfirm>
          </Col>
        </Row>
      ),
    },
  ];
  useEffect(() => {
    AirlineStore.getAirlineDetails();
  }, []);
  return useObserver(() => {
    return AirlineStore.pilots.length > 0 ? (
      <div style={{ height: '100%', maxHeight: '90vh' }}>
        <Col span={2} offset={21}>
          <Button
            type="primary"
            style={{ margin: '8px' }}
            onClick={() => {
              AirlineStore.getAirlineDetails();
            }}
          >
            Refresh
          </Button>
        </Col>
        <Row gutter={[8, 8]} style={{ height: '90%', margin: '6px' }} key={2}>
          <Col span={24}>
            <Table
              title={() => <h2>Pilots</h2>}
              columns={PILOTS_COLUMNS}
              dataSource={AirlineStore.pilots}
              style={{ height: '100%' }}
              pagination={{ pageSize: 9 }}
            ></Table>
          </Col>
        </Row>
      </div>
    ) : (
      <h1>Loading ...</h1>
    );
  });
}

export default Pilots;
