import {Button, Form, Input, InputNumber} from 'antd';
import {FireOutlined} from "@ant-design/icons";
import {useState} from "react";
import {FormattedMessage} from "react-intl";

const {TextArea} = Input;

export default function TemplateRedbook({onGenerateClick}) {
  const [form] = Form.useForm();
  const [count, setCount] = useState(600);
  const [loading, setLoading] = useState(false);
  const onFinish = async ({name, detail}) => {
    setLoading(true)
    onGenerateClick({
      content: `主题: ${name}\n主要内容: ${detail}`,
      body: {name, detail, count},
      template_text: [name, detail, count],
      template_id: 'redbook'
    }).then(() => {
      setLoading(false);
    });
  };
  return (
    <Form
      form={form}
      name="horizontal_login"
      onFinish={onFinish}
      layout="vertical"
    >
      <FormattedMessage id="workspace.script.redbook.name.placeholder">
        {(msg) => (
          <Form.Item
            label={<FormattedMessage id="workspace.script.name"/>}
            name="name"
          >
            <TextArea rows={3} placeholder={msg}/>
          </Form.Item>
        )}
      </FormattedMessage>
      <FormattedMessage id="workspace.script.redbook.detail.placeholder">
        {(msg) => (
          <Form.Item
            label={<FormattedMessage id="workspace.script.detail"/>}
            name="detail"
          >
            <TextArea rows={6} placeholder={msg}/>
          </Form.Item>
        )}
      </FormattedMessage>
      <Form.Item
        label={<FormattedMessage id="workspace.script.wordCount"/>}
        name="count"
        initialValue={count}
      >
        <InputNumber min={100} step={100} max={1000} onChange={(val) => setCount(val)}/>
      </Form.Item>
      <Form.Item shouldUpdate style={{textAlign: 'right'}}>
        {() => {
          return (
            <>
              <Button
                htmlType="submit"
                loading={loading}
              >
                <FormattedMessage id="workspace.function.template.generate"/>
                <FireOutlined/>
              </Button>
            </>
          )
        }}

      </Form.Item>
    </Form>
  );
}
