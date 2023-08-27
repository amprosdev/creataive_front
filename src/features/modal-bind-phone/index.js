import {useContext, useState} from "react";
import './index.scss';
import {Button, Form, Input, Modal} from "antd";
import {FormattedMessage} from "react-intl";
import {EventContext} from "@/context";
import {MailOutlined, PhoneOutlined} from "@ant-design/icons";
import {bindPhone, sendSmsCode} from "@/services/setting";
import store from "store";
import {initOrganization} from "@/services/organization";

export default function ModalContactUs() {
  const [open, setOpen] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [phoneNub, setPhoneNub] = useState(null);
  const event = useContext(EventContext);

  event.useSubscription(({type, val}) => {
    if (type === 'modal-bind-phone') {
      setOpen(true);
    }
  });
  const onFinish = (values) => {
    bindPhone(values).then((res) => {
      if (res.code === 1) {
        return;
      }
      store.set('_authing_token', res.data);
      console.log(res);
      initOrganization().then((resp) => {
        if (resp.code === 0) {
          window.location.reload();
        }
      });
    })
  };

  const sendSMSCode = () => {
    console.log(phoneNub);
    sendSmsCode({
      phone: phoneNub
    }).then((res) => {
      if (res.code === 1) {
        return;
      }
      // 开始计时器
      setCountdown(60);// 设置倒计时的秒数
      const timer = setInterval(() => {
        if (countdown > 0) {
          setCountdown(countdown - 1);
        } else {
          clearInterval(timer);
        }
      }, 1000);
    })
  }

  return (
    <>
      <Modal
        className="modal-bind-phone"
        open={open}
        title={<FormattedMessage id="bindPhone.title"/>}
        footer={null}
        width={335}
        destroyOnClose={true}
        onCancel={() => setOpen(false)}
      >
        <div className="bind-phone-box">
          <div className="bind-phone-content">
            <Form
              name="bind-phone"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="phone"
                rules={[
                  {
                    required: true,
                    message: ''
                  },
                ]}
              >
                <Input prefix={<PhoneOutlined className="site-form-item-icon"/>}
                       type="text"
                       onBlur={(e) => setPhoneNub(e.target.value)}

                />
              </Form.Item>
              <div className="code-and-send">
                <Form.Item
                  name="code"
                  rules={[
                    {
                      required: true,
                      message: ''
                    },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="site-form-item-icon"/>}
                    type="text"
                  />
                </Form.Item>
                <Button className="send-sms-code"
                        onClick={sendSMSCode}
                        disabled={countdown > 0}
                >{countdown > 0 ? `${countdown}s` : <FormattedMessage id="sendSMSCode"/>}</Button>
              </div>

              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  <FormattedMessage id="sendSMSCode"/>
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
}
