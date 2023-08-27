import { useState } from "react";
import {Button, Input, message, Modal, Space, Typography} from "antd";
import './index.scss';
import {flattenData, parseTokens} from "@/utils/ppt";
import {createPPT} from "@/services/ppt";
import MarkdownIt from "markdown-it";
import {createRecord} from "@/services/proxy-sync-generate";
import {generateRecord} from "@/utils/generate";
const TextArea = Input.TextArea;
const Search = Input.Search;

const md = new MarkdownIt();
export default function PPTImportAI({ refresh }) {
  const [markdown, setMarkdown] = useState('');
  const [generating, setGenerating] = useState(false);
  const [loading, setLoding] = useState(false);
  const [done, setDone] = useState(false);
  const [topics, setTopics] = useState([
    'ESG 碳中和', '转正答辩', '技术分享', '项目进度汇报'
  ]);
  const [topic, setTopic] = useState('');

  const [open, setOpen] = useState(false);
  const goToDetail = (id) => {
    window.location.href = `/ppt-editor/${id}`
    // navigate(`/ppt-editor/${data.id}`);
  }
  const importCreate = () => {
    const tokens = md.parse(markdown, {});
    const {docTree,docContent,title} = parseTokens(tokens);
    createPPT({
      title,
      subTitle: 'SUBTITLE HERE',
      speaker: 'CreatAIve Show',
      speakerTime: new Date(),
      docTree: JSON.stringify(docTree),
      docContent: JSON.stringify(docContent),
    }).then(({ data }) => {
      goToDetail(data.id);
    });
  };
  const onTopicListClick = (topic) => {
    setTopic(topic);
    onGeneratePPT(topic);
  }

  const onGeneratePPT = (text) => {
    setGenerating(true);
    setDone(false);
    setMarkdown('');
    createRecord(74, {
      streaming: true,
      body: {
        topic: text,
      },
    }).then(({data}) => {
      let text = '';
      setLoding(true);
      generateRecord(data.id, (content) => {
        text += content;
        setMarkdown(text);
      }, () => {
        console.log('finished')
        setGenerating(false);
        setDone(true);
      });
    });
  };
  return (
    <div className="ppt-import-md-ai">
      <Button type="primary" onClick={() => setOpen(true)}>一键 AI 生成</Button>
      <Modal
        open={open}
        title={'AI PPT'}
        onCancel={() => setOpen(false)}
        width={560}
        centered={true}
        footer={null}
      >
        <div className="add-document-body">
          <Space direction="vertical" style={{width: '100%'}}>
            <Search
              placeholder="请输入 PPT 主题"
              enterButton="生成"
              size="large"
              onChange={(e) => setTopic(e.target.value)}
              loading={generating}
              value={topic}
              onSearch={() => onGeneratePPT(topic)}
            />
            <div style={{paddingLeft: 5}}>
              <Space>
                {
                  topics.map((item, index) => (
                    <Typography.Link onClick={() => onTopicListClick(item)} key={index}>
                      { item }
                    </Typography.Link>
                  ))
                }
              </Space>
            </div>
            {
              loading &&
              <>
                <TextArea
                  name=""
                  style={{padding: 10, width: '100%', boxSizing: 'border-box'}}
                  rows="20"
                  placeholder="请输入或粘贴需要导入的 markdown"
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                >
                </TextArea>
                <div>
                  <Button type="primary" size="large" disabled={!done} onClick={importCreate}>创建 PPT</Button>
                </div>
              </>
            }
          </Space>
        </div>
      </Modal>
    </div>
  );
}
