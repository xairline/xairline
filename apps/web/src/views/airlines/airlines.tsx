import { Button, Card, Col, Form, Input, Layout, Row } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { useObserver } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';
import { useStores } from '../../store';
import './airlines.module.css';

/* eslint-disable-next-line */
export interface AirlinesProps {
  history: any;
}

export function Airlines(props: AirlinesProps) {
  const { AirlineStore } = useStores();
  const history = useHistory();
  return useObserver(() => (
    <div>
      <Layout style={{ minHeight: '100vh' }}>
        <Content
          style={{ marginLeft: '25vw', marginRight: '25vw', marginTop: '25vh' }}
        >
          <Row align="bottom">
            <Col flex="1 0 10%">
              <Card title="Create your airline!" style={{ width: '100%' }}>
                <Form
                  name="basic"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={async (values) => {
                    await AirlineStore.createAirline(values);
                    await AirlineStore.getAirlineDetails();
                    history.push('/');
                  }}
                  //onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  style={{ margin: '5vh' }}
                >
                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: 'Please type your airline name',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item wrapperCol={{ offset: 10, span: 8 }}>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </div>
  ));
}

export default Airlines;
