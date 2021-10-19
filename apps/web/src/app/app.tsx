import { GithubOutlined } from '@ant-design/icons';
import faker from 'faker';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import {
  faBezierCurve,
  faBook,
  faBuilding,
  faInfoCircle,
  faPlane,
  faPlaneArrival,
  faPlaneDeparture,
  faTachometerAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getLogger } from '@xairline/shared-logger';
import {
  Avatar,
  Badge,
  Button,
  Col,
  Divider,
  Drawer,
  Form,
  Input,
  Layout,
  Menu,
  Row,
  Select,
  Tooltip,
} from 'antd';
import { shell } from 'electron';
import { useLocalObservable, useObserver } from 'mobx-react-lite';
import React from 'react';
import { HashRouter, Link, Redirect, Route } from 'react-router-dom';
import { environment } from '../environments/environment';
import { IRoute } from '../interfaces';
import {
  Airline as RemoteAirline,
  AirlineRelationsApi,
} from '@xairline/shared-rest-client-remote';
import { useStores } from '../store';
import Airlines from '../views/airlines/airlines';
import Fleet from '../views/fleet/fleet';
import { FlightLog } from '../views/flight-log/flight-log';
import FlyNow from '../views/fly-now/fly-now';
import Headquarter from '../views/headquarter/headquarter';
import Home from '../views/home/home';
import { Select as MySelect } from '../views/select/select';
import './app.module.css';
import { Style } from './styled';
import AirlineManagement from '../views/airline-management/airline-management';
import { runInAction } from 'mobx';
import { remoteConfiguration } from '../store/constants';
import Pilots from '../views/pilots/pilots';
import md5 from 'md5';
const airlineRelationsApi = new AirlineRelationsApi(remoteConfiguration);

const logger = getLogger();
const { Header, Footer, Sider, Content } = Layout;
const MenuItem = Menu.Item;
const Root = Style;
const { Option } = Select;

export const routes: Array<IRoute> = [
  {
    path: '/',
    exact: true,
    name: 'Home',
    icon: (
      <FontAwesomeIcon
        icon={faTachometerAlt}
        style={{ marginLeft: '10px', marginRight: '10px' }}
        size={'1x'}
      />
    ),
    comp: () => <Home />,
  },
  {
    path: '/fly-now',
    name: 'Fly Now!',
    icon: (
      <FontAwesomeIcon
        icon={faPlaneDeparture}
        style={{ marginLeft: '10px', marginRight: '8px' }}
        size={'1x'}
      />
    ),
    comp: () => <FlyNow />,
  },
  {
    name: 'divider',
    path: '',
  },
  {
    path: '/headquarter',
    name: 'Headquarter',
    icon: (
      <FontAwesomeIcon
        icon={faBuilding}
        style={{ marginLeft: '10px', marginRight: '14px' }}
        size={'1x'}
      />
    ),
    comp: () => <Headquarter />,
  },
  // hq sub menus
  {
    path: '/flight-log',
    name: 'Flight Log',
    icon: (
      <FontAwesomeIcon
        icon={faBook}
        style={{ marginLeft: '30px', marginRight: '14px' }}
        size={'1x'}
      />
    ),
    comp: () => <FlightLog />,
  },
  {
    path: '/fleet',
    name: 'Fleet',
    icon: (
      <FontAwesomeIcon
        icon={faPlane}
        style={{ marginLeft: '30px', marginRight: '10px' }}
        size={'1x'}
      />
    ),
    comp: () => <Fleet />,
  },
  {
    path: '/routes',
    name: 'Routes',
    icon: (
      <FontAwesomeIcon
        icon={faBezierCurve}
        style={{ marginLeft: '30px', marginRight: '8px' }}
        size={'1x'}
      />
    ),
    comp: () => <MySelect />,
  },
  {
    path: '/pilots',
    name: 'Pilots',
    icon: (
      <FontAwesomeIcon
        icon={faUser}
        style={{ marginLeft: '30px', marginRight: '14px' }}
        size={'1x'}
      />
    ),
    comp: () => <Pilots />,
  },
  {
    path: '/airline-mgmt',
    name: 'Airlines',
    icon: (
      <FontAwesomeIcon
        icon={faPlaneArrival}
        style={{ marginLeft: '10px', marginRight: '10px' }}
        size={'1x'}
      />
    ),
    comp: () => <AirlineManagement />,
  },
];

export const App = () => {
  const { AirlineStore, RouterStore } = useStores();
  const [form] = Form.useForm();
  const localStore = useLocalObservable(() => ({
    showDrawer: false,
    toggleDrawer() {
      localStore.showDrawer = !localStore.showDrawer;
      form.resetFields();
    },
  }));
  return useObserver(() => (
    <>
      <Drawer
        title="Airline Configuration"
        width={'30vw'}
        onClose={localStore.toggleDrawer}
        visible={localStore.showDrawer}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form
          form={form}
          layout="vertical"
          hideRequiredMark
          onFinish={async (values) => {
            AirlineStore.updateAirline({
              ...(AirlineStore.activeAirline as RemoteAirline),
              name: values.name,
              callsign: values.callsign,
            });
            localStore.toggleDrawer();
          }}
        >
          <Col span={24}>
            <Row gutter={16}>
              <Form.Item
                name="ID"
                label="Id"
                initialValue={AirlineStore.activeAirline?.id}
                style={{ width: '300px' }}
              >
                <Input disabled={true} />
              </Form.Item>
            </Row>
            <Row gutter={16}>
              <Form.Item
                name="Role"
                label="Role"
                initialValue={AirlineStore.isOwner ? 'Owner' : 'Pilot'}
                style={{ width: '300px' }}
              >
                <Input disabled={true} />
              </Form.Item>
            </Row>
          </Col>
          <Row align="middle">
            <Col span={16}>
              <Row gutter={16}>
                <Form.Item
                  name="name"
                  label="Name"
                  initialValue={AirlineStore.activeAirline?.name}
                  rules={[{ required: true, message: 'Please enter name' }]}
                >
                  <Input disabled={!AirlineStore.isOwner} />
                </Form.Item>
              </Row>
              <Row gutter={16}>
                <Form.Item
                  name="callsign"
                  label="Callsign"
                  initialValue={
                    AirlineStore.activeAirline?.callsign || 'Set your callsign'
                  }
                  rules={[
                    {
                      pattern: new RegExp('[a-zA-Z0-9]'),
                      message: 'Please enter callsign onle Letters and Numbers',
                    },
                    {
                      max: 3,
                      min: 2,
                      message: 'Only 2 or 3 characters',
                    },
                  ]}
                >
                  <Input disabled={!AirlineStore.isOwner} />
                </Form.Item>
              </Row>
            </Col>
            <Col span={8} style={{ verticalAlign: 'middle' }}>
              <img
                alt="Profile pic"
                src={
                  AirlineStore?.activeAirline?.profilePic ||
                  faker.image.imageUrl(128, 128, 'animals', true)
                }
                width="64"
                onClick={
                  AirlineStore.isOwner
                    ? () => {
                        // create the widget
                        const widget = (
                          window as any
                        ).cloudinary.createUploadWidget(
                          {
                            cloudName: 'hujopfcpk',
                            uploadPreset: 'j7hoowzy',
                            multiple: false,
                            maxFiles: 1,
                          },
                          (error: any, result: any) => {
                            if (error) {
                              logger.error(error);
                            }
                            if (result.event === 'success') {
                              logger.info(result.info.secure_url);
                              AirlineStore.updateAirline({
                                ...(AirlineStore.activeAirline as RemoteAirline),
                                profilePic: result.info.secure_url,
                              });
                            }
                            if (result.event === 'abort') {
                              widget.close();
                            }
                          }
                        );
                        widget.open();
                      }
                    : () => {
                        alert('You are not the owner of this airline');
                      }
                }
              />
            </Col>
          </Row>
          <Form.Item wrapperCol={{ offset: 10, span: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!AirlineStore.isOwner}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
        <Divider />
        <Select
          placeholder="Select an airline you want to fly for"
          onChange={(value) => {
            const airline: RemoteAirline = JSON.parse(value as string);
            runInAction(() => {
              AirlineStore.activeAirline = airline;
              AirlineStore.getAirlineDetails();

              localStore.toggleDrawer();
            });
          }}
          style={{ width: '100%' }}
        >
          {AirlineStore.availabileAirlines.map((airline) => {
            return (
              <Select.Option value={JSON.stringify(airline)} key={airline.name}>
                {airline.name}
              </Select.Option>
            );
          })}
        </Select>
        {AirlineStore.isOwner ? (
          <>
            <Divider />
            <Tooltip
              title="You need to mark your airline as public before you can ask other pilots
        to join."
            >
              <h3>
                Make my airline public
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  style={{ marginLeft: '8px' }}
                  size={'1x'}
                />
              </h3>
            </Tooltip>
            <Form
              layout="vertical"
              onFinish={async (values) => {
                await AirlineStore.updateAirline({
                  ...(AirlineStore.activeAirline as RemoteAirline),
                  email: md5(values.Email) as string,
                });
                await airlineRelationsApi.createOneBaseAirlineRelationsControllerAirlineToAirlineRelation(
                  {
                    owner_id: AirlineStore.activeAirline?.id as string,
                    pilot_id: AirlineStore.activeAirline?.id as string,
                    status: 'approved',
                  }
                );
                localStore.toggleDrawer();
              }}
            >
              <Col span={24}>
                <Row gutter={16}>
                  <Form.Item
                    name="Email"
                    label={
                      <Tooltip title="Your actual Email is not stored on the server. It is hashed so no one can guess what it is. Email will be used to claim ownership of an airline if you ever lost your airline.">
                        Email
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          style={{ marginLeft: '8px' }}
                          size={'1x'}
                        />
                      </Tooltip>
                    }
                    style={{ width: '100%' }}
                    rules={[
                      {
                        required: true,
                        message: 'Please type your email',
                        type: 'email',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Row>
              </Col>

              <Form.Item wrapperCol={{ offset: 9, span: 8 }}>
                <Button danger type="primary" htmlType="submit">
                  Go PUBLIC!
                </Button>
              </Form.Item>
            </Form>
          </>
        ) : null}
      </Drawer>
      <HashRouter>
        {AirlineStore.isLoaded ? (
          <div>
            {AirlineStore.activeAirline ? (
              <Root>
                <Layout style={{ minHeight: '100vh' }}>
                  <Sider
                    style={{
                      minHeight: '100vh',
                    }}
                    collapsible={false}
                  >
                    <div className="logo">
                      <Button onClick={localStore.toggleDrawer} type="text">
                        <Avatar
                          src={
                            AirlineStore.activeAirline.profilePic ||
                            faker.image.imageUrl(128, 128, 'animals', true)
                          }
                          style={{ marginRight: '16px' }}
                        />
                        <span className="user">
                          <strong style={{ color: '#6d9eeb' }}>
                            {AirlineStore.activeAirline.name}
                          </strong>
                        </span>
                      </Button>
                      {/* <PoweroffOutlined onClick={() => alert(':)')} /> */}
                    </div>
                    <Menu
                      theme="dark"
                      defaultSelectedKeys={[
                        RouterStore.getDefaultSelectedKeys(),
                      ]}
                      onSelect={(info) => {
                        RouterStore.selectedMenuKey = parseInt(info.key);
                      }}
                    >
                      {routes.map((route, index) => {
                        if (route.name === 'divider') {
                          return <Menu.Divider key={index} />;
                        }
                        return (
                          <MenuItem key={index}>
                            <Link to={route.path}>
                              {route.icon || ''}
                              <span className="nav-text">{route.name}</span>
                            </Link>
                          </MenuItem>
                        );
                      })}
                    </Menu>
                    <Row
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '25%',
                        marginBottom: '20px',
                      }}
                    >
                      <Col span={8} offset={8}>
                        <a
                          onClick={() => {
                            shell.openExternal('https://xairline.org');
                          }}
                        >
                          {' '}
                          <img
                            src="assets/icon.png"
                            style={{ maxWidth: '66.66px' }}
                          />
                        </a>
                      </Col>
                    </Row>
                  </Sider>
                  <Layout style={{ height: '100vh' }}>
                    <Content className="main-content">
                      {routes.map((route: IRoute, index) => {
                        return (
                          <Route
                            key={index}
                            exact={route.exact}
                            path={route.path}
                            component={route.comp}
                          />
                        );
                      })}
                    </Content>

                    <Footer
                      style={{
                        textAlign: 'center',
                        padding: '10px 0 10px',
                        background: '#4f545c',
                        color: '#6d9eeb',
                      }}
                    >
                      <Row>
                        <Col span={4}>
                          <a
                            onClick={() => {
                              shell.openExternal(
                                'https://www.buymeacoffee.com/di.zou'
                              );
                            }}
                          >
                            <img
                              width="60%"
                              src={
                                'https://img.buymeacoffee.com/button-api/?text=KEEP US RUNNING&emoji=✈️&slug=di.zou&button_colour=009988&font_colour=ffffff&font_family=Lato&outline_colour=ffffff&coffee_colour=FFDD00'
                              }
                            />
                          </a>
                        </Col>
                        <Col span={16}>
                          X Airline ©2021 Created by Di Zou -{' '}
                          {environment.version}{' '}
                          {AirlineStore.updateAvailable ? (
                            <Badge
                              count={'New version available!'}
                              title={AirlineStore.remoteVersion}
                              style={{ backgroundColor: '#b2b206' }}
                            />
                          ) : (
                            <Badge
                              count={'Latest version'}
                              style={{ backgroundColor: '#52c41a' }}
                              title={AirlineStore.remoteVersion}
                            />
                          )}
                        </Col>
                        <Col span={4}>
                          <Button
                            icon={<FontAwesomeIcon icon={faDiscord} />}
                            size="small"
                            onClick={() => {
                              shell.openExternal(
                                'https://discord.gg/Es52XxTPJq'
                              );
                            }}
                          >
                            Discord
                          </Button>
                        </Col>
                      </Row>
                    </Footer>
                  </Layout>
                </Layout>
              </Root>
            ) : (
              <div>
                <Route path="/airlines" component={Airlines} />
                <Redirect to="/airlines" />
              </div>
            )}
          </div>
        ) : null}
      </HashRouter>
    </>
  ));
};
