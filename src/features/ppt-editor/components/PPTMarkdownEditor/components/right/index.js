import React, {useContext, useEffect} from 'react';
import {observer} from 'mobx-react';
import List from './list';
import {FormOutlined, SisternodeOutlined, SubnodeOutlined} from "@ant-design/icons";
import {generateRecord} from "@/utils/generate";
import {createRecord} from "@/services/proxy-sync-generate";
import {getContentWithParents} from "@/utils/ppt";
import {Divider} from "antd";
import {EventContext} from "@/context";

const RightComponent = observer(({data, moveItem, changeContent, clickContent, removeNode, addItem}) => {
  // Add useState hook to manage `showArea` state
  const [showArea, setShowArea] = React.useState(false);
  const [areaConfig, setAreaConfig] = React.useState({});
  const event = useContext(EventContext);
  const setAreaConfigFn = (config) => {
    setShowArea(true);
    setAreaConfig(config);
  }

  // Expand nodes, expand outline, expand content.
  /**
   * 扩充节点
   * @param item
   */
  const aiExpandNodes = () => {
    createRecord(76, {
      streaming: true,
      body: {
        topic: data[0].content,
        chain: getContentWithParents(data, areaConfig.id),
      },
    }).then(({data}) => {
      let text = '';
      let index = areaConfig.preLength;
      let id = null;

      function addItemFn() {
        console.log(index);
        return addItem(areaConfig.id, 'text', '', index);
      }

      generateRecord(data.id, (content) => {
        if (content === '-') {
          text = '';
          id = addItemFn().id;
          index++;
        } else {
          text += content;
          changeContent(id, text);
        }
      }, () => {
        console.log('finished')
      });
    });
  }
  /**
   * 扩充大纲
   * @param item
   */
  const aiExpandOutline = () => {
    createRecord(77, {
      streaming: true,
      body: {
        topic: data[0].content,
        chain: getContentWithParents(data, areaConfig.id),
      },
    }).then(({data}) => {
      let text = '';
      let index = areaConfig.preLength;
      let id = null;

      function addItemFn() {
        console.log(index);
        return addItem(areaConfig.id, 'text', '', index);
      }

      generateRecord(data.id, (content) => {
        if (content === '-') {
          text = '';
          id = addItemFn().id;
          index++;
        } else {
          text += content;
          changeContent(id, text);
        }
      }, () => {
        console.log('finished')
      });
    });
  }
  /**
   * 扩充内容
   * @param item
   */
  const aiExpandContent = () => {
    createRecord(78, {
      streaming: true,
      body: {
        topic: data[0].content,
        chain: getContentWithParents(data, areaConfig.id),
        text: document.getElementById('markdownRoot').innerText,
      },
    }).then(({data}) => {
      let text = '';
      generateRecord(data.id, (content) => {
        if (content === '-') {
          console.log('需要换行了');
        }
        text += content;
        changeContent(areaConfig.id, text);
      }, () => {
        console.log('finished')
      });
    });
  }
  event.useSubscription(({type, url, name}) => {
    if (type === 'select-image') {
      areaConfig.addItem('image', `![${name}](${url}))`);
    }
  });
  useEffect(() => {
    const handleClick = (event) => {
      const fnArea = document.getElementsByClassName('fn-area')[0];
      if (fnArea && fnArea.contains(event.target)) {
        return;
      }
      setShowArea(false);
    };
    const element = document.getElementById('detail');
    element.addEventListener("click", handleClick);
    return () => {
      element.removeEventListener("click", handleClick);
    };
  }, []);
  return (
    <>
      {
        showArea &&
        <div className="fn-area" style={{'top': areaConfig.clientY, left: areaConfig.clientX}}>
          <div className="fn-item" onClick={() => {
            areaConfig.addItem();
            setShowArea(false);
          }}>
            <span>
              <svg width="19" height="19" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
                   data-v-bb6ce268=""><rect width="48" height="48" fill="white" fillOpacity="0.01"
                                            data-v-bb6ce268=""></rect><path d="M10 28V35H18" stroke="#333"
                                                                            strokeWidth="2" strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            data-v-bb6ce268=""></path><path
                d="M18 28H42V42H18V35V28Z" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round" data-v-bb6ce268=""></path><line x1="6" y1="13.5" x2="6" y2="12.5" stroke="#333"
                                                                       strokeWidth="2" strokeLinecap="round"
                                                                       strokeLinejoin="round"
                                                                       data-v-bb6ce268=""></line><line x1="6" y1="20"
                                                                                                       x2="6" y2="19"
                                                                                                       stroke="#333"
                                                                                                       strokeWidth="2"
                                                                                                       strokeLinecap="round"
                                                                                                       strokeLinejoin="round"
                                                                                                       data-v-bb6ce268=""></line><line
                x1="6" y1="7" x2="6" y2="6" stroke="#333" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round" data-v-bb6ce268=""></line><line x1="32" y1="13.5" x2="32" y2="12.5"
                                                                       stroke="#333" strokeWidth="2"
                                                                       strokeLinecap="round" strokeLinejoin="round"
                                                                       data-v-bb6ce268=""></line><line x1="32" y1="20"
                                                                                                       x2="32" y2="19"
                                                                                                       stroke="#333"
                                                                                                       strokeWidth="2"
                                                                                                       strokeLinecap="round"
                                                                                                       strokeLinejoin="round"
                                                                                                       data-v-bb6ce268=""></line><line
                x1="32" y1="7" x2="32" y2="6" stroke="#333" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round" data-v-bb6ce268=""></line><line x1="32" y1="20" x2="31" y2="20" stroke="#333"
                                                                       strokeWidth="2" strokeLinecap="round"
                                                                       strokeLinejoin="round"
                                                                       data-v-bb6ce268=""></line><line x1="7" y1="20"
                                                                                                       x2="6" y2="20"
                                                                                                       stroke="#333"
                                                                                                       strokeWidth="2"
                                                                                                       strokeLinecap="round"
                                                                                                       strokeLinejoin="round"
                                                                                                       data-v-bb6ce268=""></line><line
                x1="7" y1="6" x2="6" y2="6" stroke="#333" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round" data-v-bb6ce268=""></line><line x1="13" y1="6" x2="12" y2="6" stroke="#333"
                                                                       strokeWidth="2" strokeLinecap="round"
                                                                       strokeLinejoin="round"
                                                                       data-v-bb6ce268=""></line><line x1="19.5" y1="6"
                                                                                                       x2="18.5" y2="6"
                                                                                                       stroke="#333"
                                                                                                       strokeWidth="2"
                                                                                                       strokeLinecap="round"
                                                                                                       strokeLinejoin="round"
                                                                                                       data-v-bb6ce268=""></line><line
                x1="19.5" y1="20" x2="18.5" y2="20" stroke="#333" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round" data-v-bb6ce268=""></line><line x1="26" y1="6" x2="25" y2="6" stroke="#333"
                                                                       strokeWidth="2" strokeLinecap="round"
                                                                       strokeLinejoin="round"
                                                                       data-v-bb6ce268=""></line><line x1="13" y1="20"
                                                                                                       x2="12" y2="20"
                                                                                                       stroke="#333"
                                                                                                       strokeWidth="2"
                                                                                                       strokeLinecap="round"
                                                                                                       strokeLinejoin="round"
                                                                                                       data-v-bb6ce268=""></line><line
                x1="26" y1="20" x2="25" y2="20" stroke="#333" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round" data-v-bb6ce268=""></line><line x1="32" y1="6" x2="31" y2="6" stroke="#333"
                                                                       strokeWidth="2" strokeLinecap="round"
                                                                       strokeLinejoin="round"
                                                                       data-v-bb6ce268=""></line></svg>
            </span>
            <span>添加节点</span>
            <span className="shortcut-key"></span>
          </div>
          <div className="fn-item" onClick={() => {
            setShowArea(false);
            event.emit({
              type: 'modal-library',
            });
          }}>
            <span>
              <svg width="19" height="19" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
                   data-v-bb6ce268=""><rect width="48" height="48" fill="white" fillOpacity="0.01"
                                            data-v-bb6ce268=""></rect><path d="M10 28V35H18" stroke="#333"
                                                                            strokeWidth="2" strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            data-v-bb6ce268=""></path><path
                d="M18 28H42V42H18V35V28Z" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round" data-v-bb6ce268=""></path><line x1="6" y1="13.5" x2="6" y2="12.5" stroke="#333"
                                                                       strokeWidth="2" strokeLinecap="round"
                                                                       strokeLinejoin="round"
                                                                       data-v-bb6ce268=""></line><line x1="6" y1="20"
                                                                                                       x2="6" y2="19"
                                                                                                       stroke="#333"
                                                                                                       strokeWidth="2"
                                                                                                       strokeLinecap="round"
                                                                                                       strokeLinejoin="round"
                                                                                                       data-v-bb6ce268=""></line><line
                x1="6" y1="7" x2="6" y2="6" stroke="#333" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round" data-v-bb6ce268=""></line><line x1="32" y1="13.5" x2="32" y2="12.5"
                                                                       stroke="#333" strokeWidth="2"
                                                                       strokeLinecap="round" strokeLinejoin="round"
                                                                       data-v-bb6ce268=""></line><line x1="32" y1="20"
                                                                                                       x2="32" y2="19"
                                                                                                       stroke="#333"
                                                                                                       strokeWidth="2"
                                                                                                       strokeLinecap="round"
                                                                                                       strokeLinejoin="round"
                                                                                                       data-v-bb6ce268=""></line><line
                x1="32" y1="7" x2="32" y2="6" stroke="#333" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round" data-v-bb6ce268=""></line><line x1="32" y1="20" x2="31" y2="20" stroke="#333"
                                                                       strokeWidth="2" strokeLinecap="round"
                                                                       strokeLinejoin="round"
                                                                       data-v-bb6ce268=""></line><line x1="7" y1="20"
                                                                                                       x2="6" y2="20"
                                                                                                       stroke="#333"
                                                                                                       strokeWidth="2"
                                                                                                       strokeLinecap="round"
                                                                                                       strokeLinejoin="round"
                                                                                                       data-v-bb6ce268=""></line><line
                x1="7" y1="6" x2="6" y2="6" stroke="#333" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round" data-v-bb6ce268=""></line><line x1="13" y1="6" x2="12" y2="6" stroke="#333"
                                                                       strokeWidth="2" strokeLinecap="round"
                                                                       strokeLinejoin="round"
                                                                       data-v-bb6ce268=""></line><line x1="19.5" y1="6"
                                                                                                       x2="18.5" y2="6"
                                                                                                       stroke="#333"
                                                                                                       strokeWidth="2"
                                                                                                       strokeLinecap="round"
                                                                                                       strokeLinejoin="round"
                                                                                                       data-v-bb6ce268=""></line><line
                x1="19.5" y1="20" x2="18.5" y2="20" stroke="#333" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round" data-v-bb6ce268=""></line><line x1="26" y1="6" x2="25" y2="6" stroke="#333"
                                                                       strokeWidth="2" strokeLinecap="round"
                                                                       strokeLinejoin="round"
                                                                       data-v-bb6ce268=""></line><line x1="13" y1="20"
                                                                                                       x2="12" y2="20"
                                                                                                       stroke="#333"
                                                                                                       strokeWidth="2"
                                                                                                       strokeLinecap="round"
                                                                                                       strokeLinejoin="round"
                                                                                                       data-v-bb6ce268=""></line><line
                x1="26" y1="20" x2="25" y2="20" stroke="#333" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round" data-v-bb6ce268=""></line><line x1="32" y1="6" x2="31" y2="6" stroke="#333"
                                                                       strokeWidth="2" strokeLinecap="round"
                                                                       strokeLinejoin="round"
                                                                       data-v-bb6ce268=""></line></svg>
            </span>
            <span>添加图片节点</span>
            <span className="shortcut-key"></span>
          </div>

          {
            areaConfig.contentType === 'text' &&
            <>
              <div className="fn-item" onClick={() => {
                aiExpandContent();
                setShowArea(false);
              }}>
            <span>
              <FormOutlined/>
            </span>
                <span>节点内容优化（AI）</span>
                <span className="shortcut-key"></span>
              </div>

              <Divider/>

              <div className="fn-item" onClick={() => {
                areaConfig.addChild();
                setShowArea(false);
              }}>
            <span>
              <svg width="19" height="19" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
                   data-v-bb6ce268=""><path fill="#fff" fillOpacity=".01" d="M0 0h48v48H0z" data-v-bb6ce268=""></path><path
                d="M24 30v-6M6 30h36v12H6V30zM6 12.5v-1M6 18v-1M6 7V6M42 12.5v-1M42 18v-1M42 7V6M42 18h-1M7 18H6M7 6H6M14 6h-1M21 6h-1M21 18h-1M28 6h-1M14 18h-1M28 18h-1M35 6h-1M35 18h-1M42 6h-1"
                stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                data-v-bb6ce268=""></path></svg>
            </span>
                <span>添加子节点</span>
                <span className="shortcut-key">Tab</span>
              </div>
              <div className="fn-item" onClick={() => {
                aiExpandNodes();
                setShowArea(false);
              }}>
            <span>
              <SubnodeOutlined/>
            </span>
                <span>生成子节点大纲（AI）</span>
                <span className="shortcut-key"></span>
              </div>
              <div className="fn-item" onClick={() => {
                aiExpandOutline();
                setShowArea(false);
              }}>
            <span>
              <SisternodeOutlined/>
            </span>
                <span>生成子节点内容（AI）</span>
                <span className="shortcut-key"></span>
              </div>
            </>
          }

          <Divider/>

          <div className="fn-item" onClick={() => {
            areaConfig.deleteItem();
            setShowArea(false);
          }}>
            <span>
              <svg width="19" height="19" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
                   data-v-bb6ce268=""><rect width="48" height="48" fill="white" fillOpacity="0.01"
                                            data-v-bb6ce268=""></rect><path d="M9 10V44H39V10H9Z" fill="none"
                                                                            stroke="#333" strokeWidth="2"
                                                                            strokeLinejoin="round"
                                                                            data-v-bb6ce268=""></path><path
                d="M20 20V33" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                data-v-bb6ce268=""></path><path d="M28 20V33" stroke="#333" strokeWidth="2" strokeLinecap="round"
                                                strokeLinejoin="round" data-v-bb6ce268=""></path><path d="M4 10H44"
                                                                                                       stroke="#333"
                                                                                                       strokeWidth="2"
                                                                                                       strokeLinecap="round"
                                                                                                       strokeLinejoin="round"
                                                                                                       data-v-bb6ce268=""></path><path
                d="M16 10L19.289 4H28.7771L32 10H16Z" fill="none" stroke="#333" strokeWidth="2" strokeLinejoin="round"
                data-v-bb6ce268=""></path></svg>
            </span>
            <span>删除节点</span>
            <span className="shortcut-key"></span>
          </div>
        </div>
      }
      <div className="right">
        <List
          parentId={null}
          items={data}
          move={moveItem}
          change={changeContent}
          click={clickContent}
          remove={removeNode}
          add={addItem}
          fnArea={setAreaConfigFn} // Use `setShowArea` to update `showArea`
        />
      </div>
    </>
  );
});

export default RightComponent;
