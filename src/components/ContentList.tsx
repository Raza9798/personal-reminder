import React, { useEffect, useState } from "react";
import { Col, Input, Row, theme } from 'antd';
import { Button, Form, notification } from 'antd';
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { List, Empty} from 'antd';
import { CheckOutlined, CloseOutlined,  } from '@ant-design/icons';
import { Space, Switch } from 'antd';
import { TimePicker } from 'antd';
import dayjs from 'dayjs';
import axios from "axios";
const baseUrl = 'http://localhost:3030/';
const format = 'HH:mm:ss';
const ContentList: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [api, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    useEffect(() => {
        const reminder = localStorage.getItem('reminder');
        if (reminder) {
            const parsedData = JSON.parse(reminder);

            parsedData.forEach((element: any) => {
                axios.get(baseUrl, {
                    params: {
                        title: element.title,
                        duration: element.duration,
                        enable: false
                    }
                })
            });

            const updatedData = parsedData.map((element: any) => ({
                ...element,
                enable: false
            }));

            setData(updatedData);
        }
    }, []);

    const onFinish = (values: any) => {
        setData([...data, {
            title: values.title,
            enable: false,
            duration: values.duration.format(format),
        }]);
        form.resetFields();
    };

    return (
        <div>
            {contextHolder}
            <Row style={{
                position: 'sticky',
                top: 0,
                padding: 10,
                background: colorBgContainer,
                zIndex: 1,
            }}>
                <Col span={24} >
                    <Form
                        layout="horizontal"
                        form={form}
                        name="reminder_form"
                        onFinish={onFinish}
                        style={{ minWidth: 600, }}
                    >
                        <Row gutter={10}>
                            <Col span={15}>
                                <Form.Item name="title" rules={[{ required: true }]}>
                                    <Input placeholder="Add a reminder" />
                                </Form.Item>

                            </Col>
                            <Col>
                                <Form.Item name="duration" rules={[{ required: true }]}>
                                    <TimePicker placeholder="Duration period" format={format} />
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item >
                                    <Button type="primary" htmlType="submit" icon={<PlusCircleOutlined />}>
                                        ADD
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>

                    </Form>
                </Col>
            </Row>

            <Row style={{ marginTop: 0 }}>
                <Col span={24}>
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        locale={{ emptyText: <Empty description="No reminders on list" /> }}
                        renderItem={(item, index) => (
                            <List.Item actions={[
                                <Space direction="vertical">
                                    <TimePicker defaultValue={dayjs(`${item.duration}`, format)} format={format} disabled />
                                </Space>,
                                <Space direction="vertical">
                                    <Switch
                                        checkedChildren={<CheckOutlined />}
                                        unCheckedChildren={<CloseOutlined />}
                                        defaultChecked={item.enable}
                                        onChange={(checked) => {
                                            const newData = [...data];
                                            newData[index].enable = checked;
                                            setData(newData);
                                            if (item.duration !== '00:00:00') {
                                                if (item.duration === '00:00:01' || item.duration === '00:00:02' || item.duration === '00:00:03' || item.duration === '00:00:04') {
                                                    api.error({
                                                        message: 'Unable to set the reminder, Removing the reminder',

                                                        description:
                                                            'Please add the reminder duration more than 5 seconds',
                                                    });

                                                    setInterval(() => {
                                                        const newData = [...data];
                                                        newData.splice(index, 1);
                                                        setData(newData);
                                                        return
                                                    }, 10000);
                                                    return;
                                                }
                                                axios.get(baseUrl, {
                                                    params: {
                                                        title: item.title,
                                                        duration: item.duration,
                                                        enable: checked
                                                    }
                                                }).then((response) => {
                                                    localStorage.setItem('reminder', JSON.stringify(data));
                                                })
                                            } else {
                                                api.error({
                                                    message: 'Unable to set the reminder',
                                                    description:
                                                        'Please add the reminder duration more than 5 seconds',
                                                    duration: 0,
                                                });
                                            }
                                        }}
                                    />
                                </Space>,
                                <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => {
                                    if (item.enable) {
                                        api.error({
                                            message: 'Unable to delete the reminder',
                                            description:
                                                'Please disable the reminder before deleting',
                                            duration: 0,
                                        });
                                        return;
                                    }
                                    const newData = [...data];
                                    newData.splice(index, 1);
                                    setData(newData);
                                    localStorage.setItem('reminder', JSON.stringify(newData));
                                }}></Button>
                            ]}>
                                <List.Item.Meta
                                    avatar={(index + 1)}
                                    title={item.title}
                                />
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default ContentList;