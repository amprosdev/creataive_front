import TemplateTiktok from "./TemplateTiktok";
import TemplateWechat from "./TemplateWechat";
import TemplateRedbook from "./TemplateRedbook";
import TemplateProduct from "./TemplateProduct";
import TemplateBranding from "./TemplateBranding";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {LeftOutlined, LoginOutlined, ReloadOutlined} from "@ant-design/icons";
import {Button, List, message, Modal} from "antd";
import {EventContext} from "@/context";
import {saveMessage, createRecord, generateRecordText} from "@/services/proxy-sync-generate";
import {FormattedMessage, useIntl} from "react-intl";
import {generateRecord} from "@/utils/generate";
import {marked} from "marked";


function _buildTemplateList(onTemplateGenerateClick) {
  return [
    {
      icon: <span className="btn-wechat-file"></span>,
      label: <FormattedMessage id="template.wechat"/>,
      key: 'wechat',
      div: <TemplateWechat onGenerateClick={onTemplateGenerateClick}/>
    }, {
      icon: <span className="btn-video-file"></span>,
      label: <FormattedMessage id="template.tiktok"/>,
      key: 'tiktok',
      div: <TemplateTiktok onGenerateClick={onTemplateGenerateClick}/>
    }, {
      icon: <span className="btn-media-file"></span>,
      label: <FormattedMessage id="template.redbook"/>,
      key: 'redbook',
      div: <TemplateRedbook onGenerateClick={onTemplateGenerateClick}/>
    }, {
      icon: <span className="btn-sku-file"></span>,
      label: <FormattedMessage id="template.sku"/>,
      key: 'sku',
      div: <TemplateProduct onGenerateClick={onTemplateGenerateClick}/>
    }, {
      icon: <span className="btn-branding-file"></span>,
      label: <FormattedMessage id="template.branding"/>,
      key: 'branding',
      div: <TemplateBranding onGenerateClick={onTemplateGenerateClick}/>
    }, {
      icon: <span className="btn-more-file"></span>,
      label: <FormattedMessage id="template.more"/>,
      key: 'more',
      div: '',
    }
  ];
}

/**
 * AI template 区域
 * @returns {JSX.Element}
 * @constructor
 */
function AITemplate({generateTemplate}) {
  const event = useContext(EventContext);
  const [template, setTemplate] = useState(null);
  const templateList = _buildTemplateList(onTemplateGenerateClick);

  function onTemplateGenerateClick({content, body, template_id, template_text}) {
    return generateTemplate({content, body, template_id, template_text}).then(() => {
      setTemplate(null);
    });
  }

  const onTemplateClick = ({key}) => {
    if (key === 'more') {
      event.emit({
        type: 'modal-contact-us',
        val: 1,
      });
      return;
    }
    setTemplate(templateList.find(item => item.key === key));
  };

  return (
    <div className='ai-function-template'>
      <div className="ai-function-label">
        <span className="ai-function-label-title">
          <FormattedMessage id="workspace.function.label.selected"/>
        </span>
      </div>
      <div className="template-small-list">
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 2,
            xl: 3,
            xxl: 4,
          }}
          dataSource={templateList}
          renderItem={(item, index) => (
            <List.Item>
              <div className="template-small" onClick={() => onTemplateClick(item)} key={index}>
                <div className="template-small-top">{item.icon}</div>
                <div className="template-small-label">{item.label}</div>
              </div>
            </List.Item>
          )}
        />
      </div>
      {
        template &&
        <div className="inspire-me-template">
          <div className="inspire-me-template-header">
            <LeftOutlined className="inspire-me-template-header-back" onClick={() => setTemplate(null)}/>
            {template.label}
          </div>
          <div className="inspire-me-template-body">
            {template.div}
          </div>
        </div>
      }
    </div>
  )
}

function AITemplateModal({generateModalTemplate}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const templateList = _buildTemplateList(onTemplateGenerateClick);

  function onTemplateGenerateClick({content, body, template_id, template_text}) {
    return generateModalTemplate({content, body, template_id, template_text}).then(() => {
      navigate(location.pathname, {replace: true});
      setTemplate(null);
    });
  }

  useEffect(() => {
    if (location.state && location.state.key) {
      setTemplate(templateList.find(item => item.key === location.state.key));
    }
  }, []);
  const handleCancel = () => {
    navigate(location.pathname, {replace: true});
    setTemplate(null);
  };

  return (
    <>
      {
        template &&
        <Modal title={template.label} open={!!template} onCancel={handleCancel} footer={null}>
          {template.div}
        </Modal>
      }
    </>
  )
}

function AITitle(settings) {
  const [data, setData] = useState([]);
  const event = useContext(EventContext);
  const [isLoading, setIsLoading] = useState(false);
  const intl = useIntl();


  event.useSubscription(({type}) => {
    if (type === 'ai-function-generate-title') {
      event.emit({
        type: 'switch-ai-tabs',
        key: 'ai-function',
      });
      onGenerateTitleClick()
    }
  });

  function onGenerateTitleClick({settings}) {
    const htmlData = window.editor.current.editor.getData()
    // 创建一个临时div元素
    const tempDiv = document.createElement('div');
    // 将DOM字符串作为innerHTML属性设置给临时div元素
    tempDiv.innerHTML = htmlData;
    // 获取临时div元素中的纯文本
    const plainText = tempDiv.textContent;
    if (plainText.length < 10) {
      message.error(intl.formatMessage({id: 'plain.text.error'}));
      return;
    }
    setIsLoading(true);
    createRecord(46, {
      streaming: false,
      body: {
        plainText: plainText.substring(0, 2000),
        lang: settings.lang
      },
    }).then(({data}) => {
      generateRecordText(data.id).then((resp) => {
        const titles = resp.data.map(({message}) => {
          return {
            content: message.content.replace(/^"|"$/g, ''),
            role: message.role
          }
        })
        setData(titles);
      }).catch(() => {
        message.error(intl.formatMessage({id: 'generation.text.error'}))
      }).finally(() => {
        setIsLoading(false);
      });
    })
  }

  function onTitleUseClick(title) {
    event.emit({
      type: 'export-set-title',
      val: title
    });
  }

  return (
    <div className="ai-function-title">
      <div className="ai-function-label">
        <span className="ai-function-label-title"><FormattedMessage id="workspace.function.action.title"/></span>
        {
          data.length > 0 &&
          <span style={{cursor: "pointer"}} onClick={()=>{onGenerateTitleClick(settings)}}>
            <ReloadOutlined/>
            <FormattedMessage id="workspace.function.action.change"/>
          </span>
        }
      </div>
      <div className="ai-function-title-body">
        {
          isLoading ?
            <div className="ai-function-title-body-empty">
              <FormattedMessage id="loading.text.first"/>
            </div>
            :
            (
              data.length ?
                data.map((item, index) => {
                  return (
                    <div key={index} className="ai-function-suggest-title"
                         onClick={() => onTitleUseClick(item.content)}>
                      <span className="ai-function-suggest-title-text">{item.content}</span>
                      <LoginOutlined/>
                    </div>
                  )
                })
                :
                <div className="ai-function-title-body-empty">
                  <FormattedMessage id="workspace.function.action.title.desc"/>
                  <span className="ai-function-title-btn" onClick={()=>{onGenerateTitleClick(settings)}}>
                    <FormattedMessage id="workspace.function.action.title"/>
                  </span>
                </div>
            )
        }
      </div>
    </div>
  )
}

/**
 * AI Action 区域
 * @returns {JSX.Element}
 * @constructor
 */
function AIAction({generateContent}) {
  const event = useContext(EventContext);
  const [aiOptimizing, setAiOptimizing] = useState(false);
  const [expanding, setExpanding] = useState(false);
  const [simplifying, setSimplifying] = useState(false);

  const autoFormat = () => {
    event.emit({
      type: 'export-auto-format',
    });
  };
  const aiOptimize = () => {
    setAiOptimizing(true);
    event.emit({
      type: 'export-ai-optimize',
      finallyCallback: () => setAiOptimizing(false),
    });
  };
  const aiExpanding = () => {
    setExpanding(true);
    generateContent({template_id: 'expand'}, () => {
      setExpanding(false);
    });
  }
  const aiSimplifying = () => {
    setSimplifying(true);
    generateContent({template_id: 'simplify'}, () => {
      setSimplifying(false);
    });
  }
  return (
    <div className="ai-function-action">
      <div className="ai-function-label">
        <span className="ai-function-label-title">
          <FormattedMessage id="workspace.function.label.optimize"/>
        </span>
      </div>
      <div className="ai-function-action-group">
        {/*<Button onClick={autoFormat}>
          <FormattedMessage id="workspace.function.template.autoformat"/>
        </Button>*/}
        <Button onClick={aiOptimize} loading={aiOptimizing}>
          <FormattedMessage id="workspace.function.template.aiformat"/>
        </Button>
        <Button onClick={aiExpanding} loading={expanding}>
          <FormattedMessage id="workspace.function.template.expand"/>
        </Button>
        <Button onClick={aiSimplifying} loading={simplifying}>
          <FormattedMessage id="workspace.function.template.simplify"/>
        </Button>
      </div>
    </div>
  )
}

export default function AIFunction({settings, setContent, conversation}) {
  const event = useContext(EventContext);
  const params = useParams();
  const conversation_id = conversation;
  const intl = useIntl();

  function generateContent({template_id, body}, finalCallback) {
    const range = window.editor.current.editor.model.document.selection.getFirstRange();
    let selectedText = '';
    for (const item of range.getItems()) {
      selectedText += item.data || ' ';
    }
    if (selectedText.length > 1200) {
      message.error(intl.formatMessage({id: 'length.overflow.error'}));
      finalCallback && finalCallback();
      return;
    }
    if (selectedText.length < 10) {
      message.error(intl.formatMessage({id: 'length.short.error'}));
      finalCallback && finalCallback();
      return;
    }
    if (selectedText) {
      generateTemplate({
        template_id,
        body: {content: selectedText},
        content: selectedText,
      }).finally(finalCallback);
    }
  }

  async function generateTemplate({content, body, template_id}) {
    let promptId = null;
    switch (template_id) {
      case 'wechat':
        promptId = 45;
        break
      case 'tiktok':
        promptId = 47;
        break
      case 'branding':
        promptId = 48;
        break
      case 'redbook':
        promptId = 49;
        break
      case 'sku':
        promptId = 50;
        break
      case 'simplify':
        promptId = 52;
        break
      case 'expand':
        promptId = 53;
        break
      default:
        this.message.error(intl.formatMessage({id: 'network.error'}));
        break;
    }
    return saveMessage({
      content,
      template_id: promptId,
      template_text: {
        ...body,
        tone: settings.tone,
        lang: settings.lang,
      },
      conversation_id,
    }).then(() => {
      event.emit({
        type: 'switch-ai-tabs',
        key: 'ai-assistant',
      });
    });
  }

  function generateModalTemplate({body, template_id}) {
    let promptId = null;
    switch (template_id) {
      case 'wechat':
        promptId = 45;
        break
      case 'tiktok':
        promptId = 47;
        break
      case 'branding':
        promptId = 48;
        break
      case 'redbook':
        promptId = 49;
        break
      case 'sku':
        promptId = 50;
        break
      default:
        this.message.error(intl.formatMessage({id: 'network.error'}));
        break;
    }
    return createRecord(promptId, {
      streaming: true,
      body: {
        ...body,
        tone: settings.tone,
        lang: settings.lang,
      },
    }).then(({data}) => {
      let text = '';
      generateRecord(data.id, (content) => {
        text += content;
        const htmlString = marked(text);
        setContent(htmlString);
      }, () => {
        console.log('finished')
      });
    });
  }

  return (
    <div className="ai-function">
      <div>
        <AITitle settings={settings}/>
      </div>
      <div>
        <AITemplate generateTemplate={generateTemplate}/>
      </div>
      <div>
        <AIAction generateContent={generateContent}/>
      </div>
      <AITemplateModal generateModalTemplate={generateModalTemplate}/>
    </div>
  )
}
