import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getLogger } from '@xairline/shared-logger';
import {
  Airline as RemoteAirline,
  AirlineV2Api as RemoteAirlineApi,
  Plane,
  PlaneApi,
} from '@xairline/shared-rest-client-remote';
import {
  SupportedAircrafts,
  XPlaneData,
} from '@xairline/shared-xplane-data';
import {
  Button,
  Col,
  Divider,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Slider,
  Space,
  Table,
  Tooltip,
} from 'antd';
import { SortOrder } from 'antd/lib/table/interface';
import { useObserver } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { AirlineApi } from '../../rest-client';
import { useStores } from '../../store';
import { configuration, remoteConfiguration } from '../../store/constants';
const logger = getLogger();
const planeApi = new PlaneApi(remoteConfiguration);
const airlineApi = new AirlineApi(configuration);
const remoteAirlieApi = new RemoteAirlineApi(remoteConfiguration);
const COMMON_PLANE_COLUMNS = [
  {
    title: 'Type',
    dataIndex: 'aircraft_type',
    key: 'type',
    filterSearch: true,
    filters: SupportedAircrafts().map((aircraft) => {
      return { text: aircraft, value: aircraft };
    }),
    onFilter: (value: any, record: Plane) =>
      record.aircraft_type.indexOf(value) === 0,
  },
  {
    title: 'Capacity',
    dataIndex: 'capacity',
    key: 'capacity',
    sorter: (a: any, b: any) => a.capacity - b.capacity,
    render: (value: number) => {
      let res = 0;
      res = XPlaneData.dataRoundup((value as number) / 60);
      return `${res} hrs`;
    },
  },
];
/* eslint-disable-next-line */
export interface FleetProps {}

export function Fleet(props: FleetProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [listingPlane, setListingPlane] = useState({} as any);
  const [inputValue, setInputValue] = useState(listingPlane.listed_price);

  const { FleetStore, AirlineStore } = useStores();
  const airlineId = AirlineStore.activeAirline?.id as string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  const listedPlanesColumns: any[] = [
    ...COMMON_PLANE_COLUMNS,
    {
      key: 'listed_price',
      title: 'Price',
      width: '300',
      dataIndex: 'listed_price',
      sorter: (a: any, b: any) => a.listed_price - b.listed_price,
      defaultSortOrder: 'ascend' as SortOrder,
      rowKey: 'id',
      render: (value: number) => {
        let res = 0;
        if (value > 1000000000) {
          res = XPlaneData.dataRoundup((value as number) / 1000000000);
          return `${res} B`;
        }
        if (value > 1000000) {
          res = XPlaneData.dataRoundup((value as number) / 1000000);
          return `${res} M`;
        }
        if (value > 1000) {
          res = XPlaneData.dataRoundup((value as number) / 1000);
          return `${res} K`;
        }
        return XPlaneData.dataRoundup(value as number);
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: Plane) => (
        <Popconfirm
          title={`Are sure you want to buy ${record.aircraft_type} for $${record.listed_price}?`}
          onConfirm={async () => {
            // block buy if current cash < listed value
            if (
              (AirlineStore?.activeAirline?.cash as number) * 100 <
              (record.listed_price as number) * 100
            ) {
              alert("You don't have enought fund!");
              return;
            }
            // take your money away
            const cash: number = -1 * (record.listed_price as number);
            const { data } =
              await remoteAirlieApi.airlineControllerV2UpdateCash(
                AirlineStore.activeAirline?.id as string,
                {
                  ...(AirlineStore.activeAirline as RemoteAirline),
                  cash,
                }
              );
            AirlineStore.activeAirline = data;
            // create a new plane for you
            const recordId = record.id as number;
            delete record.id;
            await planeApi.createOneBasePlaneControllerPlane({
              ...record,
              owned_by: AirlineStore?.activeAirline?.id as string,
              status: 'normal',
            });
            // mark original plane as sold
            await planeApi.updateOneBasePlaneControllerPlane(recordId, {
              ...record,
              status: 'sold',
            });
            // refresh airline details
            await AirlineStore.getAirlineDetails();
            // refresh current page
            await FleetStore.loadFleet(
              AirlineStore?.activeAirline?.id as string
            );
          }}
        >
          <Button type="primary">BUY!</Button>
        </Popconfirm>
      ),
    },
  ];
  // eslint-disable-next-line @typescript-eslint/ban-types
  const myListedPlanesColumns: any[] = [
    ...COMMON_PLANE_COLUMNS,
    {
      key: 'listed_price',
      title: 'Listed Price',
      width: '300',
      dataIndex: 'listed_price',
      sorter: (a: any, b: any) => a.listed_price - b.listed_price,
      defaultSortOrder: 'ascend' as SortOrder,
      rowKey: 'id',
      render: (value: number) => {
        let res = 0;
        if (value > 1000000000) {
          res = XPlaneData.dataRoundup((value as number) / 1000000000);
          return `${res} B`;
        }
        if (value > 1000000) {
          res = XPlaneData.dataRoundup((value as number) / 1000000);
          return `${res} M`;
        }
        if (value > 1000) {
          res = XPlaneData.dataRoundup((value as number) / 1000);
          return `${res} K`;
        }
        return XPlaneData.dataRoundup(value as number);
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: Plane) => (
        <Space>
          <Popconfirm
            title={`Are sure you want to deposit: $${record.listed_price}?`}
            onConfirm={async () => {
              const cash: number = parseFloat(
                `${record.listed_price as number}`
              );
              const { data } =
                await remoteAirlieApi.airlineControllerV2UpdateCash(
                  AirlineStore.activeAirline?.id as string,
                  {
                    ...(AirlineStore.activeAirline as RemoteAirline),
                    cash,
                  }
                );
              AirlineStore.activeAirline = data;
              // delete the plane for you
              await planeApi.deleteOneBasePlaneControllerPlane(
                record.id as number
              );

              // refresh airline details
              await AirlineStore.getAirlineDetails();
              // refresh current page
              await FleetStore.loadFleet(
                AirlineStore?.activeAirline?.id as string
              );
            }}
          >
            <Button
              type="primary"
              disabled={record.status !== 'sold' ? true : false}
            >
              Deposit
            </Button>
          </Popconfirm>
          <Popconfirm
            title={`Are sure you want to cancel your listing of ${record.aircraft_type}?`}
            onConfirm={async () => {
              const recordId = record.id as number;
              delete record.id;
              // update remote that plane is not listed
              await planeApi.updateOneBasePlaneControllerPlane(recordId, {
                ...record,
                status: 'normal',
              });
              // update fleet view
              await FleetStore.loadFleet(
                AirlineStore?.activeAirline?.id as string
              );
            }}
          >
            <Button type="primary">Cancel</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const myPlanesColumns: any[] = [
    ...COMMON_PLANE_COLUMNS,
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: Plane) => {
        const showModal = () => {
          setIsModalVisible(true);
        };

        const handleOk = async () => {
          // list plane with selected price
          const recordId = record.id as number;
          delete record.id;
          // update remote that plane is not listed
          await planeApi.updateOneBasePlaneControllerPlane(recordId, {
            ...record,
            status: 'listed',
            listed_price: inputValue,
          });

          // refresh
          await FleetStore.loadFleet(AirlineStore.activeAirline?.id as string);
          setIsModalVisible(false);
        };

        const handleCancel = () => {
          setIsModalVisible(false);
        };
        return (
          <>
            <Button
              type="primary"
              onClick={() => {
                setListingPlane(record);
                showModal();
              }}
            >
              List
            </Button>
            <Modal
              title={listingPlane.aircraft_type}
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <Row>
                <Col span={12}>
                  <Slider
                    step={500000}
                    min={Math.round(listingPlane.listed_price * 0.6)}
                    max={Math.round(listingPlane.listed_price * 1.2)}
                    onChange={(value) => setInputValue(value)}
                    defaultValue={listingPlane.listed_price}
                    marks={{ [listingPlane.listed_price]: 'Purchased Price' }}
                    value={
                      typeof inputValue === 'number'
                        ? inputValue
                        : listingPlane.listed_price
                    }
                  />
                </Col>
                <Col span={6}>
                  <InputNumber
                    min={listingPlane.listed_price * 0.8}
                    max={listingPlane.listed_price * 1.2}
                    style={{ margin: '0 16px', width: '200px' }}
                    defaultValue={listingPlane.listed_price}
                    value={inputValue}
                    controls={false}
                    onChange={(value) => setInputValue(value)}
                  />
                </Col>
              </Row>
            </Modal>
          </>
        );
      },
    },
  ];
  useEffect(() => {
    FleetStore.loadFleet(airlineId);
  }, []);
  return useObserver(() => {
    return FleetStore.isLoaded ? (
      AirlineStore.isOwner ? (
        <div style={{ height: '100%', maxHeight: '90vh' }}>
          <Col span={2} offset={21}>
            <Button
              type="primary"
              style={{ margin: '8px' }}
              onClick={() => {
                FleetStore.loadFleet(airlineId);
              }}
            >
              Refresh
            </Button>
          </Col>
          <Row gutter={[8, 8]} style={{ height: '90%', margin: '6px' }} key={2}>
            <Col span={12}>
              <Table
                title={() => (
                  <h2>
                    Marketplace
                    <Tooltip title="You can purchase planes that are listed more than your current balance. XAA will review every airline's finacial status at then end of every quarter. If you have debt when XAA audits your book, your will be considered bankrupt. All your planes will be removed and balance is rested to 0.">
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        style={{ marginLeft: '8px' }}
                        size={'1x'}
                      />
                    </Tooltip>
                  </h2>
                )}
                columns={listedPlanesColumns}
                dataSource={FleetStore.listedPlanes}
                style={{ height: '100%' }}
                pagination={{ pageSize: 9 }}
              ></Table>
            </Col>
            <Col span={12}>
              <Row key={2.1}>
                <Table
                  title={() => <h2>My Fleet</h2>}
                  style={{ width: '100%', height: '50%' }}
                  columns={myPlanesColumns}
                  dataSource={FleetStore.myPlanes}
                  pagination={{ pageSize: 3 }}
                ></Table>
              </Row>
              <Row>
                <Divider style={{ marginTop: '32px', marginBottom: '32px' }} />
              </Row>
              <Row key={2.2}>
                <Table
                  title={() => (
                    <h2>
                      My Listing
                      <Tooltip title="When other airline bought your plane, you can deposit the cheque into your account.">
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          style={{ marginLeft: '8px' }}
                          size={'1x'}
                        />
                      </Tooltip>
                    </h2>
                  )}
                  style={{ width: '100%', height: '50%' }}
                  columns={myListedPlanesColumns}
                  dataSource={FleetStore.myListedPlanes}
                  pagination={{ pageSize: 2 }}
                ></Table>
              </Row>
            </Col>
          </Row>
        </div>
      ) : (
        <h1>You can only manage fleet of your own airline</h1>
      )
    ) : (
      <h1>Loading ...</h1>
    );
  });
}

export default Fleet;
