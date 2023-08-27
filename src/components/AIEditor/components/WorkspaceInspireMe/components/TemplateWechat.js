import {Button, Form, Input} from 'antd';
import {FireOutlined} from "@ant-design/icons";
import {useState} from "react";
import {FormattedMessage} from "react-intl";

const {TextArea} = Input;

export default function TemplateWechat({onGenerateClick}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const onFinish = async ({name, detail, audience}) => {
    setLoading(true)
    onGenerateClick({
      content: `主题: ${name}\n主要内容: ${detail}\n主要受众: ${audience}`,
      body: {name, detail, audience},
      template_text: [name, detail, audience],
      template_id: 'wechat'
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
      <FormattedMessage id="workspace.script.weChat.name.placeholder">
        {(msg) => (
          <Form.Item
            label={<FormattedMessage id="workspace.script.name"/>}
            name="name"
          >
            <TextArea rows={3} placeholder={msg}/>
          </Form.Item>
        )}
      </FormattedMessage>
      <FormattedMessage id="workspace.script.weChat.detail.placeholder">
        {(msg) => (
          <Form.Item
            label={<FormattedMessage id="workspace.script.detail"/>}
            name="detail"
          >
            <TextArea rows={6} placeholder={msg}/>
          </Form.Item>
        )}
      </FormattedMessage>
      <FormattedMessage id="workspace.script.weChat.audience.placeholder">
        {(msg) => (
          <Form.Item
            label={<FormattedMessage id="workspace.script.audience"/>}
            name="audience"
          >
            <TextArea rows={3} placeholder={msg}/>
          </Form.Item>
        )}
      </FormattedMessage>
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
