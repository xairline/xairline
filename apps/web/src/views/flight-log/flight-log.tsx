import { Modal, Table } from 'antd';
import { runInAction } from 'mobx';
import { useObserver } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useStores } from '../../store';
import { Report } from '../fly-now/report/report';
import './flight-log.module.css';

/* eslint-disable-next-line */
export interface FlightLogProps {}

export function FlightLog(props: FlightLogProps) {
  const { FlightLogStore, AirlineStore } = useStores();
  useEffect(() => {
    FlightLogStore.init();
  }, []);
  const flightDetais = (record: any) => {
    const id: number = record.id;
    runInAction(() => {
      FlightLogStore.selectedFlight = FlightLogStore.flightLog.filter(
        (flightLog) => flightLog.id === id
      )[0];
    });
  };
  const columns = [
    {
      title: 'Flight #',
      width: 100,
      dataIndex: 'name',
    },
    {
      title: 'Departure',
      width: 60,
      dataIndex: 'departure',
    },
    {
      title: 'Arrival',
      width: 60,
      dataIndex: 'arrival',
    },
    {
      title: 'Est Flight Time',
      width: 100,
      dataIndex: 'estimated_flight_time',
      render: (timeInMS: number) =>
        `${Math.round((timeInMS / 60000 / 60) * 100) / 100} hr`,
    },
    {
      title: 'Actual Flight Time',
      width: 100,
      dataIndex: 'actual_flight_time',
      render: (timeInMS: number) =>
        `${Math.round((timeInMS / 60000 / 60) * 100) / 100} hr`,
    },
    {
      title: 'Aircraft Type',
      width: 100,
      dataIndex: 'aircraft',
    },
    {
      title: 'Airline',
      width: 100,
      dataIndex: 'owner_id',
      render: (id: string) => `${id}`,
    },
    {
      title: 'Pilot',
      width: 100,
      dataIndex: 'pilot_id',
      render: (id: string) => `${id}`,
    },
  ];
  const cancel = () => {
    runInAction(() => {
      FlightLogStore.selectedFlight = undefined;
    });
  };
  // useEffect(() => {
  //   FlightLogStore.loadFlightLogs();
  // });
  return useObserver(() => {
    return (
      <div>
        <Table
          style={{ minHeight: '60vh' }}
          columns={columns}
          dataSource={FlightLogStore.flightLog}
          title={() => <h2>Flight Log</h2>}
          rowSelection={{
            type: 'radio',
            onSelect: (record, selected, rows, nativeEvent) => {
              runInAction(() => {
                flightDetais(record);
              });
            },
          }}
        />
        <Modal
          title={null}
          visible={FlightLogStore?.selectedFlight?.id !== undefined}
          onCancel={cancel}
          footer={null}
          width={'85vw'}
          bodyStyle={{ height: '75vh', overflowY: 'auto' }}
        >
          <Report flightId={FlightLogStore?.selectedFlight?.id || undefined} />
        </Modal>
      </div>
    );
  });
}

export default FlightLog;
