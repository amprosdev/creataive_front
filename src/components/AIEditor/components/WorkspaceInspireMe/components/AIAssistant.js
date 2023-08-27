import {BulbOutlined, CopyOutlined, ImportOutlined} from "@ant-design/icons";
import {useContext, useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {isMac} from "@/utils/device";
import {getMessages, saveMessage} from "@/services/proxy-sync-generate";
import {chat} from "@/utils/generate";
import {FormattedMessage, useIntl} from "react-intl";
import ReactMarkdown from "react-markdown";
import {marked} from "marked";
import remarkGfm from 'remark-gfm'
import {message} from "antd";
import {StateContext} from "@/context";

export default function AIAssistant({insertContent, settings, activeKey, conversation}) {
  const inspireResultRef = useRef();
  const params = useParams();
  const [messages, setMessages] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [show, setShow] = useState(false);
  const conversation_id = conversation;
  const intl = useIntl();
  const {mine = {}} = useContext(StateContext);

  const saveNewMessage = ({content, template_id, template_text}) => {
    if (content === '') {
      return;
    }
    saveMessage({
      content,
      template_id,
      template_text,
      tone: settings.tone,
      lang: settings.lang,
      conversation_id,
    }).then(() => {
      const newMessages = messages.concat([{
        role: 'user',
        content,
      }]);
      setMessages(newMessages);
    });
    setInputValue('');
  }

  function startGenerating() {
    const newMessages = messages.concat([{
      role: 'assistant',
      content: '',
    }])
    setMessages(newMessages);
    setGenerating(true);
    chat(conversation_id, (val) => {
      let targetMessage = newMessages[newMessages.length - 1];
      targetMessage.content += val
      setMessages(newMessages.slice(0));
    }, () => {
      setGenerating(false);
    });
  }

  useEffect(() => {
    getMessages({
      conversation_id
    }).then(({data = []}) => {
      setMessages(data);
      if (data.length > 0 && data[data.length - 1].role === 'user') {
        setGenerating(true);
      }
    });
  }, [activeKey]);
  useEffect(() => {
    if (messages?.length > 0) {
      const resultDiv = inspireResultRef.current;
      resultDiv.scrollTop = resultDiv.scrollHeight;
      let lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === 'user') {
        startGenerating();
      }
    }
  }, [messages]);
  const onInsertClick = (text) => {
    const html = marked(text)
    insertContent(html);
  }
  const onCopyClick = (text) => {
    copyToClipboard(text);
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      console.log('已成功将文本复制到剪贴板');
      message.success(intl.formatMessage({id: 'copy.success'}));
    } catch (err) {
      console.error('复制失败：', err);
    }
  }

  return (
    <div className="ai-assistant">
      <div className="inspire-me-result" ref={inspireResultRef}>
        {messages === null &&
          <span className="ai-placeholder"><FormattedMessage id="loading.tip"/>...</span>
        }
        {messages && messages.length === 0 &&
          <span className="ai-placeholder"><FormattedMessage id="workspace.ai.placeholder"/></span>
        }
        {messages?.map((item, index) => {
          const len = messages.length - 1;
          return (
            <div className="message-item" key={index}>
              {
                item.role === 'user' ?
                  <div className="message-icon me">{mine.avatar ?
                    <img src={mine.avatar + '?imageMogr2/crop/100x100/gravity/center'} alt=""/> :
                    <FormattedMessage id="me"/>}</div>
                  :
                  <div className="message-icon"><BulbOutlined/></div>
              }
              <div className={`message-content ${len === index && generating ? 'generating' : ''}`}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  escapeHtml={true}
                  children={item.content.replace(/\n\n/g, "\n")}
                  /* openai 会返回两个换行符，转换成 html 会多一行*/
                >
                </ReactMarkdown>
              </div>
              <CopyOutlined className="btn-message-insert first" onClick={() => onCopyClick(item.content)}/>
              <ImportOutlined className="btn-message-insert" onClick={() => onInsertClick(item.content)}/>
            </div>
          )
        })}
      </div>
      <div className="inspire-me-input-wrapper">
        <FormattedMessage id="workspace.assistant.chat.placeholder">
          {(msg) => (
            <textarea
              name=""
              rows="10"
              placeholder={msg}
              className="inspire-me-input"
              value={inputValue}
              disabled={generating}
              onKeyDown={(e) => {
                if ((isMac() && e.metaKey || !isMac() && e.ctrlKey) && e.key === 'Enter') {
                  !generating && saveNewMessage({content: inputValue});
                }
              }}
              onChange={(e) => setInputValue(e.target.value)}
            />
          )}
        </FormattedMessage>
        <div className="inspire-me-generate" onClick={() => !generating && saveNewMessage({content: inputValue})}>
          {isMac() ? 'Cmd+Enter ' : 'Ctrl+Enter '}
          <FormattedMessage id="workspace.assistant.chat.send"/>
        </div>
      </div>
    </div>
  )
}
