import './index.scss';
import {BulbOutlined, FormOutlined} from "@ant-design/icons";
import {Tabs} from "antd";
import AIFunction from './components/AIFunction';
import AIAssistant from './components/AIAssistant';
import AISettings from './components/AISettings';
import {useContext, useEffect, useState} from "react";
import {EventContext} from "@/context";
import {FormattedMessage} from "react-intl";
import {marked} from "marked";
import {generateRecord} from "@/utils/generate";


export default function InspireMe({setContent, insertContent, conversation}) {
  const [activeKey, setActiveKey] = useState('ai-function');
  const [settings, setSettings] = useState({
    lang: '中文',
    tone: 'official'
  });
  const event = useContext(EventContext);
  useEffect(() => {
    if (conversation === null) {
      // 拿个conversation
      event.emit({
        type: 'export-save-document',
      });
    }
  }, [conversation, event]);
  event.useSubscription(({type, key}) => {
    if (type === 'switch-ai-tabs') {
      setActiveKey(key);
    }
  });
  event.useSubscription(({type, id}) => {
    if (type === 'branding') {
      sendGetData(id);
    }
  });
  const sendGetData = (id) => {
    let text = '';
    generateRecord(id, (content) => {
      text += content;
      const htmlString = marked(text);
      setContent(htmlString);
    }, () => {
      console.log('finished')
    });
  }
  const onChange = (key) => {
    setActiveKey(key)
  };
  const items = [
    {
      key: 'ai-function',
      label: <div className="ai-tab-label"><FormOutlined/><FormattedMessage id="workspace.inspire.tab.generate"/></div>,
      children: <AIFunction settings={settings} setContent={setContent} conversation={conversation}/>,
    },
    {
      key: 'ai-assistant',
      label: <div className="ai-tab-label"><FormOutlined/><FormattedMessage id="workspace.inspire.tab.assistant"/>
      </div>,
      children: <AIAssistant settings={settings} insertContent={insertContent} activeKey={activeKey}
                             conversation={conversation}/>,
    },
    {
      key: 'ai-settings',
      label: <div className="ai-tab-label"><FormOutlined/><FormattedMessage id="workspace.inspire.tab.settings"/></div>,
      children: <AISettings setSettings={setSettings}/>,
    },
  ];
  return (
    <div className="inspire-me">
      <div className="inspire-me-header">
        <div className="inspire-me-header-left"><BulbOutlined/> Inspire Me</div>
      </div>
      <Tabs activeKey={activeKey} size="small" items={items} onChange={onChange}/>
    </div>
  );
}
