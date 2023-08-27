import React, {useContext, useEffect, useRef, useState} from 'react';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import WorkspaceImages from './components/WorkspaceImages';
import WorkspaceInspireMe from './components/WorkspaceInspireMe';
import {message} from "antd";
import {toJpeg} from "html-to-image";
import download from "downloadjs";
import {getArticleById, updateArticle} from "@/services/document";
import {postAutoFormat} from "@/services/proxy-sync-generate";
import './index.scss';
import {EventContext} from "@/context";
import {BulbOutlined} from "@ant-design/icons";
import {FormattedMessage, useIntl} from "react-intl";
import {StateContext} from "../../context";
import {createConversations} from "../../services/document";
import {createRecord, generateRecordText} from "../../services/proxy-sync-generate";
import {marked} from "marked";
import {generateRecord} from "../../utils/generate";
import {useLocation} from "react-router-dom";

export default function AIEditor({id}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [doc, setDoc] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [readyToSave, setReadyToSave] = useState(false);
  const [conversation, setConversation] = useState('');
  const editorRef = useRef(null);
  const event = useContext(EventContext);
  const location = useLocation();
  const {mine = {}, org = {}} = useContext(StateContext);

  const intl = useIntl();


  event.useSubscription(({type, callback}) => {
    if (type === 'editor-export-image') {
      exportToImage(callback);
    }
  });
  event.useSubscription(({type, val}) => {
    if (type === 'export-save-document') {
      onSaveClick();
    }
  });
  event.useSubscription(({type, val}) => {
    if (type === 'export-auto-format') {
      autoFormat();
    }
  });
  event.useSubscription(({
                           type,
                           errCallback = () => {
                           },
                           finallyCallback = () => {
                           }
                         }) => {
    if (type === 'export-ai-optimize') {
      autoAIOptimize({
        errCallback,
        finallyCallback,
      });
    }
  });
  event.useSubscription(({type, val}) => {
    if (type === 'export-set-title') {
      setTitle(val);
      onSaveClick();
    }
  });
  useEffect(() => {
    window.editor = editorRef;
    const recordId = location?.state?.recordId
    if (recordId) {
      let text = '';
      generateRecord(recordId, (content) => {
        text += content;
        const htmlString = marked(text);
        setContent(htmlString);
      }, () => {
        console.log('finished')
      });
    }
  }, []);
  useEffect(() => {
    getArticleById(id).then(({data}) => {
      setDoc(data);
      setConversation(data.conversation);
      if (data.text) {
        setContent(data.text);
      }
      if (data.title) {
        setTitle(data.title);
      }
      setIsLoading(false);
    });
  }, [id]);
  useEffect(() => {
    if (!content) {
      return
    }
    const autoSaveHandler = setTimeout(() => {
      onSaveClick();
    }, 2500);
    return () => {
      clearTimeout(autoSaveHandler);
    }
  }, [content]);
  useEffect(() => {
    const titleRef = document.getElementById('titleRef');
    const handleInput = () => {
      titleRef.style.height = 'auto';
      titleRef.style.height = `${titleRef.scrollHeight}px`;
    };
    handleInput()
    titleRef.addEventListener('input', handleInput);
    return () => {
      titleRef.removeEventListener('input', handleInput);
    };
  }, [title]);

  function handleEditorChange(event, editor) {
    const data = editor.getData();
    setContent(data);
  }

  function autoFormat() {
    const htmlData = editorRef.current.editor.getData();
    console.log(htmlData);
    let newData = htmlData;
    // newData = htmlData.replace(/<\/p>/gi, '<br /><\/p>');
    newData = newData.replace(/<img\b[^>]*>(<\/img>)?/gi, function (match) {
      // 创建一个新的 figure 元素
      const figure = document.createElement('figure');
      figure.className = 'image';
      // figure.className = 'image image-style-side';
      // 将 img 标签添加到 figure 元素中
      figure.innerHTML = match;

      // 去掉空格
      newData = newData.replace(/&nbsp;/gi, '')
      // 去掉空行
      newData = newData.replace(/<p>&nbsp;<\/p>/gi, '');
      newData = newData.replace(/<p><\/p>/gi, '');
      // 返回新的 figure 标签
      return figure.outerHTML;
    });
    setContent(newData);
  }

  async function autoAIOptimize({errCallback, finallyCallback}) {
    const htmlData = editorRef.current.editor.getData();
    // 创建一个临时div元素
    const tempDiv = document.createElement('div');
    // 将DOM字符串作为innerHTML属性设置给临时div元素
    tempDiv.innerHTML = htmlData;
    // 获取临时div元素中的纯文本
    const plainText = tempDiv.textContent;

    const chunks = [];
    const chunkSize = 1000;

    // 将 plainText 按照每 1000 个字符分割成多个块
    for (let i = 0; i < plainText.length; i += chunkSize) {
      chunks.push(plainText.substring(i, i + chunkSize));
    }
    message.success('预计需要1分钟完成',)
    try {
      // 依次调用 postAutoFormat 方法，并按顺序等待每个请求返回结果
      for (let i = 0; i < chunks.length; i++) {
        const {data} = await createRecord(51, {
          streaming: false,
          body: {
            chunks: chunks[i],
          },
        }).then(({data}) => {
          return generateRecordText(data.id);
        })
        if (i === 0) {
          setContent(data[0].message.content);
        } else {
          // 将返回结果添加到内容中
          setContent((prevContent) => prevContent + data[0].message.content);
        }
      }
      // 执行 finallyCallback
      if (finallyCallback) {
        finallyCallback();
      }
    } catch (error) {
      // 执行 errCallback
      if (errCallback) {
        errCallback(error);
      }
    }
  }

  const imageLogo = require('./images/logo.png');
  const imageQrcode = require('./images/qrcode.png');

  function exportToImage(callback) {
    const newDiv = document.createElement('div');
    newDiv.id = 'toExport';
    newDiv.className = 'export-image-area';
    // 生成长图标题
    const titleDiv = document.createElement('div');
    titleDiv.className = 'export-image-title';
    titleDiv.innerHTML = title
    // 生成 logo 尾部

    const tail = document.createElement('div');
    tail.className = 'export-image-tail';
    tail.innerHTML = `<img class="export-image-tail-logo" src="${org.paymentType === 1 ? mine.userLogo : imageLogo}"/>`

    if (org.paymentType === 1) {
      tail.innerHTML += `<span>${mine.userSign}</span>`
    } else {
      tail.innerHTML += `<img class="export-image-tail-qr" src="${imageQrcode}"/>`
    }
    // 将 div 元素添加到页面中
    newDiv.innerHTML = titleDiv.outerHTML + editorRef.current.editor.getData() + tail.outerHTML;


    const wrapper = document.createElement('div');
    wrapper.className = 'export-image-wrapper';
    wrapper.innerHTML = newDiv.outerHTML;
    document.body.appendChild(wrapper);

    setTimeout(() => {
      const target = document.getElementById('toExport')
      toJpeg(target, {
        backgroundColor: "#fff",
      }).then(function (dataUrl) {
        download(dataUrl, `${title}.jpeg`);
        document.body.removeChild(wrapper);
        callback && callback();
      });
    }, 1000);
  }

  function onSaveClick() {
    const htmlData = editorRef.current.editor.getData();
    let gallery = '';
    const regex = /<img[^>]+src="?([^"\s]+)"?[^>]*>/i;
    const match = htmlData.match(regex);
    if (match) {
      gallery = match[1];
    }
    if (!conversation) {
      getConversation().then(({id}) => {
        updateArticleFn(htmlData, gallery, id);
      });
    } else {
      updateArticleFn(htmlData, gallery);
    }
  }

  const updateArticleFn = (text, gallery, conversation) => {
    updateArticle({
      id,
      title,
      gallery,
      conversation,
      text,
      summary: text.replace(/<[^>]*>/g, '').substring(0, 255),
    })
  }
  const getConversation = async () => {
    const {data} = await createConversations({name: 'document'})
    setConversation(data.id);
    return data;
  }

  const insertImage = (imageUrl) => {
    const editor = editorRef.current.editor;
    const viewFragment = editor.data.processor.toView(`<img src=${imageUrl} alt=""/>`);
    const modelFragment = editor.data.toModel(viewFragment);
    editor.model.insertContent(modelFragment, editor.model.document.selection.getLastPosition());
  }
  const insertContent = (htmlString) => {
    const editor = editorRef.current.editor;
    const viewFragment = editor.data.processor.toView(htmlString);
    const modelFragment = editor.data.toModel(viewFragment);
    editor.model.insertContent(modelFragment);
    // editor.model.change(writer => {
    //   const paragraph = writer.createElement( 'paragraph' );
    //   const textNode = writer.createText( text );
    //   writer.insert(textNode, paragraph);
    //   writer.insert(paragraph, editor.model.document.selection.getLastPosition());
    // });
  }
  // if (isLoading) {
  //   return (
  //     <Spin tip={<FormattedMessage id="loading.tip"/>} size="large" style={{marginTop: 100}}>
  //       <div className="content"/>
  //     </Spin>
  //   )
  // }
  const onGenerateTitleClick = () => {
    event.emit({
      type: 'ai-function-generate-title'
    });
  };

  return (
    <div className="ai-editor">
      <WorkspaceImages document={doc} insertImage={insertImage}/>
      <div className="ai-editor-main">
        <div className="ai-editor-title">
          <FormattedMessage id="workspace.content.header.placeholder">
            {(msg) => (
              <textarea
                id="titleRef"
                value={title}
                rows={1}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={msg}
                maxLength={40}
                style={{resize: "none"}}
              />
            )}
          </FormattedMessage>
          <span className="ai-editor-btn-generate-title" onClick={onGenerateTitleClick}>
            <BulbOutlined/><FormattedMessage id="workspace.function.action.title"/>
          </span>
        </div>
        <CKEditor
          editor={Editor}
          ref={editorRef}
          config={{placeholder: intl.formatMessage({id: 'CKEditor.placeholder'})}}
          data={content}
          onReady={editor => {
            // You can store the "editor" and use when it is needed.
            console.log('Editor is ready to use!', editor);
          }}
          onChange={handleEditorChange}
          onBlur={(event, editor) => {
            // console.log( 'Blur.', editor );
          }}
          onFocus={(event, editor) => {
            console.log('Focus.', editor);
          }}
        />
      </div>
      <WorkspaceInspireMe setContent={setContent} insertContent={insertContent} conversation={conversation}/>
    </div>
  );
}
