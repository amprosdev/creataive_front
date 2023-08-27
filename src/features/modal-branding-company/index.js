import {useContext, useEffect, useState} from "react";
import {Button, Checkbox, Form, Input, message, Modal} from "antd";
import {EventContext} from "@/context";
import {createRecord} from "@/services/proxy-sync-generate";
import './index.scss';
import {getProject} from "../../services/project";
import {saveArticle} from "../../services/document";
import {useNavigate} from "react-router-dom";
import {generateRecordText} from "../../services/proxy-sync-generate";
import {generateRecord} from "../../utils/generate";

export default function ModalBrandingCompany() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [name, setName] = useState('');
  const [detail, setDetail] = useState('');
  const [recordId, setRecordId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const event = useContext(EventContext);
  const [projectId, setProjectId] = useState('');
  const [item, setItem] = useState({});
  const [temporary, setTemporary] = useState({});
  const [loadingContent, setLoadingContent] = useState('');
  const [opinion, setOpinion] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionsSubmit, setQuestionsSubmit] = useState(false);
  const [showOther, setShowOther] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const questionPlanB = [
    {
      id: '1',
      question: '你的${name}品牌名称主要解决什么问题？',
      options: [
        {letter: 'A', text: '提高效率'},
        {letter: 'B', text: '增加舒适度'},
        {letter: 'C', text: '提升用户体验'},
        {letter: 'D', text: '降低成本'}
      ]
    },
    {
      id: '2',
      question: '${name}名称的核心目标客户群是？',
      options: [
        {letter: 'A', text: '企业客户'},
        {letter: 'B', text: '消费者'},
        {letter: 'C', text: '创业公司'},
        {letter: 'D', text: '教育机构'}
      ]
    },
    {
      id: '3',
      question: '在${name}细分行业中，品牌名称的竞争优势是什么？',
      options: [
        {letter: 'A', text: '创新技术'},
        {letter: 'B', text: '强大的品牌形象'},
        {letter: 'C', text: '优质的客户服务'},
        {letter: 'D', text: '有竞争力的价格'}
      ]
    },
    {
      id: '4',
      question: '你认为${name}的品牌形象应该是？',
      options: [
        {letter: 'A', text: '专业严谨'},
        {letter: 'B', text: '友好亲切'},
        {letter: 'C', text: '高端奢华'},
        {letter: 'D', text: '创新前卫'}
      ]
    },
    {
      id: '5',
      question: '${name}最需要关注哪个方面的市场营销？',
      options: [
        {letter: 'A', text: '社交媒体营销'},
        {letter: 'B', text: '电子邮件营销'},
        {letter: 'C', text: '内容营销'},
        {letter: 'D', text: '传统广告投放'}
      ]
    }
  ];
  const handleOk = () => {
    if (name) {
      setLoading(true);
      generateQuestions()
    } else {
      message.warning('请输入昵称')
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsChatOpen(false);
  };
  event.useSubscription(({type, val}) => {
    if (type === 'modal-branding-company') {
      setIsModalOpen(true);
      // setIsChatOpen(true);
    }
  });
  const onNextClick = () => {
    if (!questionsSubmit) {
      form.submit();
      setQuestionsSubmit(true);
      return;
    }
    submit();
  }
  const onFinish = (data) => {
    setLoading(true);
    createRecord(36, {
      streaming: true,
      body: {data: Object.keys(data).map(key => `${key} ${data[key].join(',')}`).join('。')}
    }).then(({data}) => {
      generateRecord(data.id, (result) => {
        setLoadingContent((prevContent) => prevContent + result);
      }, () => {
        console.log('finished');
        setLoading(false);
        setShowOther(true);
      })
    });
  }
  const submit = () => {
    createRecord(42, {
      streaming: true,
      body: {
        formData: loadingContent,
        detail,
        brandName: name,
        opinion,
      }
    }).then(({data}) => {
      setRecordId(data.id);
      onTemplateRowClick(`${name}的企业 IP 营销报告`)
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
  const generateQuestions = () => {
    createRecord(41, {
      streaming: false,
      body: {detail, name}
    }).then(({data}) => {
      generateRecordText(data.id).then(({data}) => {
        const regex = /(\d+)\.\s*(.+?)\n((?:[A-D]\.\s*.+?\n)+)/g;
        let matches = [...data[0].message.content.matchAll(regex)].map((match) => {
          const [, id, question, optionsText] = match;
          const optionsRegex = /([A-D])\. (.+)/g;
          const options = [];
          let optionMatch;
          while ((optionMatch = optionsRegex.exec(optionsText)) !== null) {
            const [, letter, text] = optionMatch;
            options.push({letter, text});
          }
          return {id, question, options};
        });
        if (!matches.length || matches[0].options.length < 2) {
          matches = replaceName(questionPlanB, name)
        }
        setQuestions(matches);
        setLoading(false);
        setIsModalOpen(false);
        setIsChatOpen(true);
      }).finally(() => {
        console.log('finished');
      })
    });
  }

  function replaceName(questions, name) {
    return questions.map(question => ({
      ...question,
      question: question.question.replace(/\${name}/g, name)
    }));
  }

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
  const onCheckboxChange = (checkedValues, name) => {
    form.setFieldsValue({
      [name]: checkedValues
    });
  };
  return (
    <div className='modal-branding-company'>
      <Modal
        title='打造企业品牌'
        open={isModalOpen}
        onOk={handleOk}
        maskClosable={false}
        okButtonProps={{disabled: !name || !detail}}
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            生成方案
          </Button>
        ]}
        onCancel={handleCancel}>
        <p>品牌名称</p>
        <Input placeholder='例如，XYZ 洗面奶' type='text' value={name}
               onChange={(e) => setName(e.target.value)}/>
        <p>品牌类型</p>
        <Input placeholder='护肤产品' type='text' value={detail}
               onChange={(e) => setDetail(e.target.value)}/>
      </Modal>
      <Modal
        title="打造企业品牌"
        open={isChatOpen}
        onOk={onNextClick}
        // okButtonProps={{disabled: !showNextBtn}}
        afterClose={() => {
          setName('')
          setDetail('')
        }}
        maskClosable={false}
        destroyOnClose={true}
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={onNextClick}>
            {questionsSubmit ? '生成方案' : '提交'}
          </Button>
        ]}
        onCancel={handleCancel}>
        <div className="form-box">
          {!questionsSubmit ?
            (
              <Form layout="vertical" form={form} name="userForm" onFinish={onFinish}>
                {
                  questions.map((item, index) => (
                    <Form.Item
                      className="question-box"
                      key={index}
                      label={item.question}
                      name={item.question}
                      normalize={(value, prevValue, prevValues) => {
                        return prevValues[item.question];
                      }}
                      rules={[
                        {
                          required: true,
                          message: '该选项必填'
                        },
                      ]}>
                      <div className="options-list">
                        {
                          <Checkbox.Group
                            options={item.options.map(item => item.text)}
                            onChange={(checkedValues) => {
                              onCheckboxChange(checkedValues, item.question)
                            }}/>
                        }
                      </div>
                    </Form.Item>
                  ))
                }
              </Form>
            ) :
            (
              <div className="summarize-box">
                <p className="summarize">{loadingContent}</p>
                {
                  showOther && (
                    <div className="bottom-box">
                      <p className="other">我还有其它品牌信息需要补充</p>
                      <input className="append-other"
                             value={opinion}
                             onChange={(e) => setOpinion(e.target.value)} type="text"/>
                    </div>
                  )
                }
              </div>
            )
          }
        </div>
      </Modal>
    </div>
  );
}
