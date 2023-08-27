import {useContext, useEffect, useState} from "react";
import {Button, Input, message, Modal} from "antd";
import {EventContext} from "@/context";
import {saveMessage, createRecord, getMessages} from "@/services/proxy-sync-generate";
import {chat} from "@/utils/generate";
import {SendOutlined} from "@ant-design/icons";
import {isMac} from "@/utils/device";
import {createConversations} from "@/services/document";
import './index.scss';
import {getProject} from "../../services/project";
import {saveArticle} from "../../services/document";
import {useNavigate} from "react-router-dom";

export default function ModalBrandingUser() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [nickName, setNickName] = useState('');
  const [conversationId, setConversationId] = useState('');
  const [text, setText] = useState('');
  const [recordId, setRecordId] = useState(null);
  const [messages, setMessages] = useState([]);
  const mainDiv = document.getElementsByClassName('chat')[0];
  const [showNextBtn, setShowNextBtn] = useState(false);
  const [inputDisable, setInputDisable] = useState(false);
  const event = useContext(EventContext);
  const [projectId, setProjectId] = useState('');
  const [item, setItem] = useState({});
  const [temporary, setTemporary] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOk = () => {
    if (nickName) {
      setLoading(true);
      createConversations({
        name: "personal"
      }).then(({code, data}) => {
        setConversationId(data.id);
      })
    } else {
      message.warning('请输入昵称')
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsChatOpen(false);
  };
  event.useSubscription(({type, val}) => {
    if (type === 'modal-branding-user') {
      setIsModalOpen(true);
    }
  });

  function buildMessage(content, role) {
    return {
      content,
      role
    }
  }

  async function sendMessage(content, template_id, template_text, doNotSave = false) {
    if (!doNotSave) {
      setMessages((prev) => prev.concat(buildMessage(content, 'user')))
    }
    await saveMessage({
      conversation_id: conversationId,
      content: content,
      template_id,
      template_text,
    }).then(() => {
      if (doNotSave) {
        // 这里需要强制开启对话
        beginConversation();
      }
    })
  }

  function beginConversation() {
    const newMessages = messages.concat([{
      role: 'assistant',
      content: '',
    }])
    setInputDisable(true);
    if (inputDisable) {
      return;
    }
    setMessages(newMessages);
    chat(conversationId, (val) => {
      if (mainDiv)
        mainDiv.scrollTop = mainDiv.scrollHeight;
      let targetMessage = newMessages[newMessages.length - 1];
      targetMessage.content += val
      setMessages(newMessages.slice(0));
    }, () => {
      console.log('finished');
      setInputDisable(false);
    })
  }

  const onSendClick = () => {
    if (inputDisable) {
      return;
    }
    setText('');
    sendMessage(text, null, null);
  }
  const onGenerateClick = () => {
    const result = messages.reduce((acc, cur) => acc + '\n' + cur.content, '');
    createRecord(37, {
      streaming: true,
      body: {result}
    }).then(({data}) => {
      console.log(data.id);
      setRecordId(data.id);
      onTemplateRowClick(`${nickName}的个人 IP 营销报告`)
    });
  }

  event.useSubscription(({type, id}) => {
    if (type === 'add-project-done') {
      onTemplateRowClick(temporary);
    }
  });
  const onTemplateRowClick = (title) => {
    getProject({pageSize: 1}).then(({code, data}) => {
      if (code === 0) {
        const latestProject = data.data[0];
        if (latestProject) {
          setProjectId(latestProject.id);
          setItem({key: null, title});
        } else {
          event.emit({
            type: 'add-project',
          });
          setTemporary({key: null, title});
        }
      }
    });
  };
  useEffect(() => {
    if (!conversationId) {
      return;
    }
    getMessages({
      conversation_id: conversationId
    }).then(({code, data}) => {
      const first = data.shift();
      setMessages(data);
      if (first === undefined) {
        sendMessage('', 2, {
          name: nickName,
        }, true).then(() => {
          setLoading(false);
          setIsModalOpen(false);
          setIsChatOpen(true);
        });
      }
    });
  }, [conversationId]);
  useEffect(() => {
    if (!conversationId) {
      return;
    }
    if (mainDiv)
      mainDiv.scrollTop = mainDiv.scrollHeight;
    let lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
      beginConversation();
    }
    if (messages.length > 5) {
      setShowNextBtn(true);
    }
  }, [messages]);
  useEffect(() => {
    if (!item.title) {
      return;
    }
    saveArticle({
      title: item.title,
      projectId,
    }).then(({code, data}) => {
      if (code === 0) {
        navigate(`/document/${data.id}`)
        event.emit({
          type: 'execution-queue',
          callback: () => {
            event.emit({
              type: 'branding',
              id: recordId,
            });
          },
        });
      }
    });
  }, [item])
  return (
    <div className='modal-branding-user'>
      <Modal
        title='建立个人 IP'
        open={isModalOpen}
        onOk={handleOk}
        okButtonProps={{disabled: !nickName}}
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            生成对话
          </Button>
        ]}
        onCancel={handleCancel}>
        <p>你的昵称是什么?</p>
        <Input placeholder='请输入' type='text' value={nickName}
               onChange={(e) => setNickName(e.target.value)}/>
      </Modal>
      <Modal
        title="建立个人 IP"
        open={isChatOpen}
        okText='生成方案'
        cancelText='取消'
        onOk={onGenerateClick}
        okButtonProps={{disabled: !showNextBtn}}
        destroyOnClose={true}
        afterClose={() => {
          setNickName('');
          setMessages([]);
        }}
        maskClosable={false}
        onCancel={handleCancel}>
        <p>与我对话，丰富你的个人IP形象</p>
        <div className="chat-content">
          <div className="chat">
            <div className="chat-list">
              {
                messages.map((message, index) => {
                  return <div className={message.role} key={index}>{message.content}</div>
                })
              }
            </div>
          </div>
          <div className="chat-bottom">
            {
              showNextBtn &&
              <div className="btn-generate" onClick={onGenerateClick}>
                现在生成个人 IP 营销报告
              </div>
            }
            <div className="chat-bottom-input">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSendClick();
                  }
                }}
              />
              <SendOutlined onClick={onSendClick}/>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
