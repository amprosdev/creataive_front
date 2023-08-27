import {Button, Form, Input} from 'antd';
import {FireOutlined} from "@ant-design/icons";
import {useState} from "react";
import {FormattedMessage} from "react-intl";

const {TextArea} = Input;

export default function TemplateBranding({onGenerateClick}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const onFinish = async ({name, detail}) => {
    setLoading(true)
    onGenerateClick({
      content: `品牌名称: ${name}\n品牌特点: ${detail}`,
      body: {name, detail},
      template_text: [name, detail],
      template_id: 'branding'
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
            label={<FormattedMessage id="workspace.script.branding.name"/>}
            name="name"
          >
            <TextArea rows={3} placeholder={msg}/>
          </Form.Item>
        )}
      </FormattedMessage>
      <FormattedMessage id="workspace.script.redbook.detail.placeholder">
        {(msg) => (
          <Form.Item
            label={<FormattedMessage id="workspace.script.branding.description"/>}
            name="detail"
          >
            <TextArea rows={6} placeholder={msg}/>
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
