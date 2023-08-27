import {useState} from "react";
import {Button, Input, message, Modal, Space} from "antd";
import './index.scss';
import {flattenData, parseTokens} from "@/utils/ppt";
import {createPPT} from "@/services/ppt";
import MarkdownIt from "markdown-it";

const TextArea = Input.TextArea;

const md = new MarkdownIt();
export default function PPTImport({refresh}) {
  const [markdown, setMarkdown] = useState('');
  const [open, setOpen] = useState(false);
  const goToDetail = (id) => {
    window.location.href = `/ppt-editor/${id}`
    // navigate(`/ppt-editor/${data.id}`);
  }
  const importCreate = () => {
    const tokens = md.parse(markdown, {});
    const {docTree, docContent, title} = parseTokens(tokens);
    if (title === '') {
      message.error('Markdown格式不正确');
      return;
    }
    createPPT({
      title,
      subTitle: 'SUBTITLE HERE',
      speaker: 'CreatAIve Show',
      speakerTime: new Date(),
      docTree: JSON.stringify(docTree),
      docContent: JSON.stringify(docContent),
    }).then(({data}) => {
      goToDetail(data.id);
    });
  };
  return (
    <div className="ppt-import-md">
      <Button onClick={() => setOpen(true)}>导入Markdown</Button>
      <Modal
        open={open}
        title={'导入 Markdown'}
        onCancel={() => setOpen(false)}
        width={560}
        centered={true}
        footer={null}
      >
        <div className="add-document-body">
          <Space direction="vertical" style={{width: '100%'}}>
            <TextArea
              name=""
              style={{padding: 10, width: '100%', boxSizing: 'border-box'}}
              rows="20"
              placeholder="请输入或粘贴需要导入的 markdown"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
            ></TextArea>
            <div>
              <Button type="primary" size="large" onClick={importCreate}>导入创建</Button>
            </div>
          </Space>
        </div>
      </Modal>
    </div>
  );
}
