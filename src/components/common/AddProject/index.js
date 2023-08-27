import {saveProject} from '@/services/project';
import {useContext, useState} from "react";
import './index.scss';
import {Modal, Input, Form} from "antd";
import {EventContext} from "@/context";
import {FormattedMessage} from "react-intl";

const {TextArea} = Input;

export default function AddProject() {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const event = useContext(EventContext);
  const [form] = Form.useForm();
  event.useSubscription(({type}) => {
    if (type === 'add-project') {
      setOpen(true);
    }
  });
  const handleOk = () => {
    form.validateFields().then(values => {
      setConfirmLoading(true);
      saveProject({
        ...values,
      }).then(({code, data}) => {
        if (code === 0) {
          setOpen(false);
          setConfirmLoading(false);
          event.emit({
            type: 'refresh-project',
          });
          event.emit({
            type: 'add-project-done',
          });
        } else {
          setConfirmLoading(false);
        }
      });
    }).catch((errorInfo) => {
      console.log(errorInfo);
    });
  };
  return (
    <>
      <Modal
        open={open}
        okText={<FormattedMessage id="btn.add"/>}
        cancelText={<FormattedMessage id="btn.cancel"/>}
        onOk={handleOk}
        destroyOnClose={true}
        confirmLoading={confirmLoading}
        onCancel={() => setOpen(false)}
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item name="name" label={<FormattedMessage id="project.dialog.title"/>} rules={[{required: true}]}>
            <Input maxLength={20}/>
          </Form.Item>
          <Form.Item name="desc" label={<FormattedMessage id="project.dialog.desc"/>}>
            <TextArea rows={4} maxLength={200}/>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
