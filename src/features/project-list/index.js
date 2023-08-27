import {saveProject, getProject} from "./services";
import FileItem from "./components/ProjectItem";
import {useEffect, useState} from "react";
import './index.scss';
import {Modal, Input, Form} from "antd";
const { TextArea } = Input;

export default function Desktop() {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [list, setList] = useState([]);
  const [form] = Form.useForm();
  const loadData = () => {
    getProject().then((resp) => {
      setList(resp.data.data);
    })
  };
  const refresh = () => {
    window.location.reload();
  };
  useEffect(() => {
    loadData();
  }, []);
  const handleOk = () => {
    form.validateFields().then(values => {
      setConfirmLoading(true);
      saveProject(values).then(({ data }) => {
        setOpen(false);
        setConfirmLoading(false);
        const newList = [data].concat(list);
        setList(newList);
        
      });
    }).catch((errorInfo) => {
      console.log(errorInfo);
    });
  };
  return (
    <div className="desktop">
      <div className="file-container">
        <div className="btn-new-file" onClick={() => setOpen(true)}></div>
      </div>
      <Modal
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => setOpen(false)}
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item name="name" label="Project Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="desc" label="Project Description">
            <TextArea rows={4}/>
          </Form.Item>
        </Form>
      </Modal>
      {
        list?.map(item =>
          <div className="file-container" key={item.id}>
            <FileItem refresh={refresh} item={item}/>
          </div>
        )
      }
    </div>
  );
}
