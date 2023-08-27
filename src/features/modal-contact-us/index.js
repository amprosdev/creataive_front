import {useContext, useState} from "react";
import './index.scss';
import {Modal, Select, Form, Button, message} from "antd";
import {FormattedMessage} from "react-intl";
import {EventContext} from "@/context";
import TextArea from "antd/es/input/TextArea";
import {postFeedbacks} from "@/services/setting";

export default function ModalContactUs() {
  const [open, setOpen] = useState(false);
  const [defaultType, setDefaultType] = useState(1);
  const event = useContext(EventContext);

  event.useSubscription(({type, val}) => {
    if (type === 'modal-contact-us') {
      setOpen(true);
      setDefaultType(val);
    }
  });
  const onFinish = (values) => {
    console.log('Success:', values);
    postFeedbacks(values).then(({code}) => {
      if (code === 0) {
        message.success('提交成功，我们会尽快联系您。');
        setOpen(false);
      }
    })
  };
  return (
    <>
      <Modal
        className="modal-contact-us"
        open={open}
        title={<FormattedMessage id="contactUs.title"/>}
        footer={null}
        width={635}
        destroyOnClose={true}
        onCancel={() => setOpen(false)}
      >
        <div className="contactUs-box">
          <div className="contactUs-left">
            <img className="wechat-qrcode" src={require('@/assets/images/wechatQrCode.jpeg')} alt=""/>
            <FormattedMessage id="contactUs.subTitle"/>
          </div>
          <div className="contactUs-middle">
            <div className="line"></div>
            <FormattedMessage id="or"/>
            <div className="line"></div>
          </div>
          <div className="contactUs-right">
            <Form
              name="control-hooks"
              layout="vertical"
              style={{maxWidth: 600}}
              onFinish={onFinish}
            >
              <Form.Item name="type" label={<FormattedMessage id="contactUs.form.first"/>}>
                <Select
                  defaultValue={defaultType}
                  style={{width: 300}}
                  options={[
                    {value: 1, label: <FormattedMessage id="contactUs.option.first"/>},
                    {value: 2, label: <FormattedMessage id="contactUs.option.second"/>},
                    {value: 3, label: <FormattedMessage id="contactUs.option.third"/>},
                    {value: 4, label: <FormattedMessage id="contactUs.option.fourth"/>},
                  ]}
                />
              </Form.Item>
              <FormattedMessage id="contactUs.description.placeholder">
                {(msg) => (
                  <Form.Item name="desc" label={<FormattedMessage id="contactUs.form.second"/>}
                             rules={[{required: true, message: <FormattedMessage id="contactUs.form.rules.message"/>}]}>
                    <TextArea
                      autoSize={{minRows: 6, maxRows: 6}}
                      placeholder={msg}
                    />
                  </Form.Item>
                )}
              </FormattedMessage>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  <FormattedMessage id="submit"/>
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
}
