import {useEffect, useState} from "react";
import {Button, Input, List, message, Modal, Space, Typography} from "antd";
import './index.scss';
import {flattenData, parseTokens} from "@/utils/ppt";
import {createPPT} from "@/services/ppt";
import MarkdownIt from "markdown-it";
import {FormattedMessage} from "react-intl";
import {createRecord} from "@/services/proxy-sync-generate";
import {generateRecord} from "@/utils/generate";
import PPTChosen from "../PPTChosen";

const TextArea = Input.TextArea;

const md = new MarkdownIt();
export default function PPTImportTransfer({refresh}) {
  const [markdown, setMarkdown] = useState('');
  const [currentStyle, setCurrentStyle] = useState(null);
  const [styles, setStyles] = useState([
    {
      title: '经典模板',
      templateId: '0',
      themeId: 'white',
      image: '/0/classic-white.jpg',
    }, {
      title: '商务简约',
      templateId: '2',
      themeId: 'serif',
      image: '/2/Cover.jpeg',
    }, {
      title: '职场必备',
      templateId: '4',
      themeId: 'solarized',
      image: '/4/Cover.jpg',
    }
  ]);
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

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
      themeId: currentStyle.themeId,
      templateId: currentStyle.templateId,
      docTree: JSON.stringify(docTree),
      docContent: JSON.stringify(docContent),
    }).then(({data}) => {
      goToDetail(data.id);
    });
  };
  const onGeneratePPT = (text, style) => {
    setMarkdown('');
    setShowMarkdown(true);
    setDone(false);
    createRecord(75, {
      streaming: true,
      body: {
        text,
        style,
      },
    }).then(({data}) => {
      let text = '';
      generateRecord(data.id, (content) => {
        text += content;
        setMarkdown(text);
      }, () => {
        setDone(true);
      });
    });
  };
  const onStyleClick = (style) => {
    setCurrentStyle(style);
    const text = window.editor.current.editor.getData();
    onGeneratePPT(text, style.title);
  };

  return (
    <div className="ppt-import">
      <Button danger size="small" onClick={() => setOpen(true)}>
        <FormattedMessage id="workspace.header.action.ppt"/>
      </Button>
      <Modal
        open={open}
        title={'请选择想要的模板'}
        onCancel={() => setOpen(false)}
        width={560}
        centered={true}
        footer={null}
      >
        <div className="add-document-body">
          {
            !currentStyle && <List
              grid={{
                gutter: 16,
                xs: 2,
                sm: 2,
                md: 3,
                lg: 3,
                xl: 3,
                xxl: 3,
              }}
              dataSource={styles}
              renderItem={(item, index) => (
                <List.Item>
                  <PPTChosen key={index} item={item} onChosenClick={onStyleClick}/>
                </List.Item>
              )}
            />
          }
          {
            showMarkdown &&
            <>
              <Space direction="vertical" style={{width: '100%'}}>
                <div>{currentStyle.title}</div>
                <TextArea
                  name=""
                  style={{padding: 10, width: '100%', boxSizing: 'border-box'}}
                  rows="20"
                  placeholder="请输入或粘贴需要导入的 markdown"
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                ></TextArea>
                <div>
                  <Button type="primary" size="large" disabled={!done} onClick={importCreate}>创建PPT</Button>
                </div>
              </Space>
            </>
          }
        </div>
      </Modal>
    </div>
  );
}
