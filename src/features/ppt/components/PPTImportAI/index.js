import {useState} from "react";
import {Input, message, Space, Typography} from "antd";
import './index.scss';
import {flattenData, parseTokens} from "@/utils/ppt";
import {createPPT} from "@/services/ppt";
import MarkdownIt from "markdown-it";
import {createRecord} from "@/services/proxy-sync-generate";
import {generateRecord} from "@/utils/generate";

const Search = Input.Search;

const md = new MarkdownIt();
export default function PPTImportAI() {
  const [generating, setGenerating] = useState(false);
  const [topics, setTopics] = useState([
    '转正答辩', '技术分享', '项目进度汇报'
  ]);
  const [topic, setTopic] = useState('');

  const goToDetail = (id) => {
    window.location.href = `/ppt-editor/${id}`
    // navigate(`/ppt-editor/${data.id}`);
  }
  const importCreate = (markdown) => {
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
  const onTopicListClick = (topic) => {
    setTopic(topic);
    onGeneratePPT(topic);
  }

  const onGeneratePPT = (text) => {
    setGenerating(true);
    createRecord(74, {
      streaming: true,
      body: {
        topic: text,
      },
    }).then(({data}) => {
      let text = '';
      generateRecord(data.id, (content) => {
        text += content;
      }, () => {
        console.log('finished');
        console.log(text)
        setGenerating(false);
        importCreate(text);
      });
    });
  };
  return (
    <div className="ppt-import-ai">
      <Space direction="vertical" style={{width: '100%'}}>
        <Search
          placeholder="请输入 PPT 主题"
          enterButton="AI 生成"
          size="large"
          onChange={(e) => setTopic(e.target.value)}
          loading={generating}
          value={topic}
          onSearch={() => onGeneratePPT(topic)}
        />
        <div className="ppt-import-ai-topics">
          <Space>
            {
              topics.map((item, index) => (
                <Typography.Link onClick={() => onTopicListClick(item)} key={index}>
                  {item}
                </Typography.Link>
              ))
            }
          </Space>
        </div>
      </Space>
    </div>
  );
}
