import { getLogger } from '@xairline/shared-logger';
import { Flight, FlightApi } from '@xairline/shared-rest-client-remote';
import {
  GetFlightTime,
  SupportedAircrafts,
  Rules,
  XPlaneData,
} from '@xairline/shared-xplane-data';
import {
  Button,
  Form,
  Input,
  Popconfirm,
  Row,
  Select as AntdSelect,
  Space,
  Table,
} from 'antd';
import { runInAction } from 'mobx';
import { useObserver } from 'mobx-react-lite';
import { useEffect } from 'react';
import { remoteConfiguration, useStores } from '../../store';
const remoteFlightApi = new FlightApi(remoteConfiguration);
const logger = getLogger();

/* eslint-disable-next-line */
export interface SelectProps {}

export function Select(props: SelectProps) {
  const { FlyNowStore, AirlineStore, RouterStore } = useStores();
  const columns = [
    {
      title: 'Flight #',
      width: 100,
      dataIndex: 'name',
    },
    {
      title: 'Departure',
      width: 100,
      dataIndex: 'departure',
      key: 'departure',
      filterSearch: true,
      filters: (FlyNowStore.bookableFlights as Flight[])
        .filter(
          (thing, index, self) =>
            index === self.findIndex((t) => t.departure === thing.departure)
        )
        .map((aircraft) => {
          return { text: aircraft.departure, value: aircraft.departure };
        }),
      onFilter: (value: any, record: any) =>
        record.departure.indexOf(value) === 0,
    },
    {
      title: 'Arrival',
      width: 100,
      dataIndex: 'arrival',
      key: 'arrival',
      filterSearch: true,
      filters: (FlyNowStore.bookableFlights as Flight[])
        .filter(
          (thing, index, self) =>
            index === self.findIndex((t) => t.arrival === thing.arrival)
        )
        .map((aircraft) => {
          return { text: aircraft.arrival, value: aircraft.arrival };
        }),
      onFilter: (value: any, record: any) =>
        record.arrival.indexOf(value) === 0,
    },
    {
      title: 'Est Flight Time',
      width: 100,
      dataIndex: 'estimated_flight_time',
      sorter: (a: any, b: any) =>
        a.estimated_flight_time - b.estimated_flight_time,
      render: (timeInMS: number) =>
        `${Math.round((timeInMS / 60000 / 60) * 100) / 100} hr`,
    },
    {
      title: 'Aircraft Type',
      width: 100,
      dataIndex: 'aircraft',
      key: 'aircraft',
      filterSearch: true,
      filters: SupportedAircrafts().map((aircraft) => {
        return { text: aircraft, value: aircraft };
      }),
      onFilter: (value: any, record: any) =>
        record.aircraft.indexOf(value) === 0,
    },
    ...(RouterStore.selectedMenuKey === 6
      ? [
          {
            title: 'Action',
            key: 'action',
            width: 100,
            render: (text: any, record: any) => (
              <Space>
                <Popconfirm
                  title={`Are sure you want to delete flight ${record.name}?`}
                  disabled={!AirlineStore.isOwner}
                  onConfirm={async () => {
                    await remoteFlightApi.deleteOneBaseFlightControllerFlight(
                      record.id
                    );
                    logger.info('delete route');
                    await FlyNowStore.loadBookableFlights();
                  }}
                >
                  <Button danger type="dashed" disabled={!AirlineStore.isOwner}>
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]
      : []),
  ];
  const [form] = Form.useForm();
  useEffect(() => {
    logger.info('loading routes');
    FlyNowStore.loadBookableFlights();
  }, []);
  return useObserver(() => {
    return (
      <div style={{ background: '#232424' }}>
        <Row>
          <Form
            name="basic"
            // labelCol={{ span: 12 }}
            // wrapperCol={{ span: 6 }}
            layout={'inline'}
            initialValues={{ remember: true }}
            onFinish={async (values) => {
              const flightTime = await GetFlightTime(
                values.departure.toUpperCase().replace(/\s/g, ''),
                values.arrival.toUpperCase().replace(/\s/g, '')
              ).catch((e) => {
                alert(
                  `Failed to get flight time between\n${values.departure.toUpperCase()} - ${values.arrival.toUpperCase()}\n${e}`
                );
              });
              if (flightTime > 0) {
                const newFlight: Flight = {
                  aircraft: values.aircraft,
                  arrival: values.arrival.toUpperCase().replace(/\s/g, ''),
                  departure: values.departure.toUpperCase().replace(/\s/g, ''),
                  estimated_flight_time: 60 * 1000 * (20 + (flightTime || 0)),
                  name: `${
                    AirlineStore.activeAirline?.callsign || 'XA'
                  }-${Math.floor(Math.random() * (5000 - 100 + 1) + 100)}`,
                  bookable: true,
                  owner_id: AirlineStore?.activeAirline?.id as string,
                  pilot_id: AirlineStore?.pilotId,
                };
                await FlyNowStore.createFlight(newFlight);
              }
            }}
            //onFinishFailed={onFinishFailed}
            autoComplete="off"
            style={{ margin: '2vh' }}
          >
            <Form.Item
              label="Departure"
              name="departure"
              rules={[
                {
                  required: true,
                  message: 'Please type your departure airport',
                },
              ]}
            >
              <Input style={{ width: '10vw' }} />
            </Form.Item>
            <Form.Item
              label="Arrival"
              name="arrival"
              rules={[
                {
                  required: true,
                  message: 'Please type your departure airport',
                },
              ]}
            >
              <Input style={{ width: '10vw' }} />
            </Form.Item>
            <Form.Item
              label="Aircraft"
              name="aircraft"
              rules={[{ required: true }]}
              initialValue="B737-800"
            >
              <AntdSelect
                placeholder="Select a option and change input text above"
                onChange={(value) => form.setFieldsValue(value)}
                showSearch
                style={{ width: '120px' }}
              >
                {getSupportedAircrafts().map((aircraft) => {
                  return (
                    <AntdSelect.Option value={value} key={`${key}`}>
                      {key}
                    </AntdSelect.Option>
                  );
                })}
              </AntdSelect>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 10, span: 8 }}>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!AirlineStore.isOwner}
              >
                Add
              </Button>
            </Form.Item>
          </Form>
        </Row>
        <Table
          rowSelection={
            RouterStore.selectedMenuKey === 1
              ? {
                  type: 'radio',
                  onSelect: (record, selected, rows, nativeEvent) => {
                    runInAction(() => {
                      FlyNowStore.selectedFlight = record;
                      FlyNowStore.flightData = XPlaneData.initFlightData();
                      FlyNowStore.rules = new Rules(
                        FlyNowStore.selectedFlight.aircraft,
                        FlyNowStore.flightData
                      );
                      FlyNowStore.getLoadSheet();
                      FlyNowStore.changeStep(1);
                    });
                  },
                }
              : undefined
          }
          columns={columns}
          dataSource={FlyNowStore.bookableFlights}
          style={{ height: '100%' }}
        />
      </div>
    );
  });
}

export default Select;
