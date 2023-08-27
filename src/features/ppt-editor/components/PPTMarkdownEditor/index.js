import React, {useContext, useEffect, useState} from 'react';
import {Modal} from "antd";
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import Left from './components/left';
import Right from './components/right';
import {EventContext} from "@/context";
import {flattenData, findItem} from "@/utils/ppt";
import './index.scss';
import {createRecord} from "../../../../services/proxy-sync-generate";
import {generateRecord} from "../../../../utils/generate";
import ModalLibrary from "@/features/modal-iibrary";


/**
 * PPT 编辑器
 * @param content
 * @param docTree
 * @param docContent
 * @param setContent
 * @param setDocTree
 * @param setDocContent
 * @returns {JSX.Element}
 * @constructor
 */
export default function PPT({content, docTree, docContent, setContent, setDocTree, setDocContent, setSyncData}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    if (docTree.length === 1 && docTree[0].content === '请输入内容' && docTree[0].children.length === 0) {
      removeNode(docTree[0].id, 'markdownRoot');
    }
    createRecord(77, {
      streaming: true,
      body: {
        topic: treeData[0].content,
        chain: treeData[0].content,
      },
    }).then(({data}) => {
      let text = '';
      let index = treeData[0].children.length;
      let id = null;

      function addItemFn() {
        console.log(index);
        return handleAddCard('markdownRoot', 'text', '', index);
      }

      generateRecord(data.id, (content) => {
        if (content === '-') {
          text = '';
          id = addItemFn().id;
          index++;
        } else {
          text += content;
          handleChange(id, text);
        }
      }, () => {
        console.log('finished')
      });
    });

    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const event = useContext(EventContext);
  const [treeData, setTreeData] = useState([]);
  const handleAddCard = (targetId, type, content = '', index = 0) => {
    const updatedData = [...treeData];
    const item = findItem(updatedData, targetId);
    const obj = {
      id: Math.ceil(Math.random() * 100000) + '',
      type,
      contentType: type,
      content,
      children: [],
    };

    if (item.children) {
      item.children.splice(index, 0, obj);
    } else {
      item.children = [obj];
    }

    setTreeData(updatedData);
    return {id: obj.id, pId: targetId};
  };

  /**
   * 删除节点
   * @param removeId
   * @param parentId
   */

  const removeNode = (removeId, parentId) => {
    const updatedData = [...treeData];
    const item = findItem(updatedData, parentId);
    const index = item.children.findIndex(child => child.id === removeId);
    item.children.splice(index, 1);
    setTreeData(updatedData);
  };

  /**
   * 拖拽移动
   * @param dragItem
   * @param overItem
   */

  const handleMove = (dragItem, overItem) => {
    const {draggedId, dragParentId} = dragItem;
    const {overId, overParentId} = overItem;

    const updatedData = [...treeData];
    const item = {...findItem(updatedData, draggedId)};
    const target = findItem(updatedData, overParentId);

    const index = target.children.findIndex(v => v.id === overId);

    removeNode(draggedId, dragParentId);
    target.children.splice(index, 0, item);

    setTreeData(updatedData);
  };

  /**
   * 修改文本内容
   * @param id
   * @param content
   */
  const handleChange = (id, content) => {
    const updatedData = [...treeData];
    const item = findItem(updatedData, id);
    item.content = content;
    setTreeData(updatedData);
  };
  /**
   * 点击 slide
   * @param id
   */
  const handleClick = (id) => {
    const updatedData = [...treeData];
    const item = findItem(updatedData, id);
    event.emit({
      type: 'on-slide-click',
      item,
    });
  };

  /**
   * 初始化数据
   */
  useEffect(() => {
    if (!docTree.length) {
      docTree.push({
        id: '1',
        content: '请输入内容',
        children: [],
        type: "text",
        contentType: "text",
      })
      showModal();
    }
    setTreeData([{
      id: 'markdownRoot',
      content: content.title,
      children: docTree,
      contentType: "text",
      level: 1,
      type: "text",
    }]);
  }, [content.title, docTree]);

  useEffect(() => {
    if (!docTree.length) {
      docTree.push({
        id: '1',
        content: ' ',
        children: [],
        type: "text",
        contentType: "text",
      })
    }
    if (!treeData.length) {
      return;
    }
    setDocContent(flattenData(treeData[0].children));
    setDocTree(treeData[0].children);
    setContent({...content, title: treeData[0].content});
    setSyncData();
  }, [treeData]);

  return (
    <div className="markdown-editor">
      <div className="header">
        <input type="text" className="ppt-title" value={content.title}
               onChange={(e) => setContent({...content, title: e.target.value})}
        />
        <span onClick={handleOk} className="ppt-title-btn">AI大纲生成</span>
        <div className="sub-title-box">
          <div className="sub-title-item">
            <span>副标题：</span>
            <input type="text" className="sub-title" value={content.subTitle}
                   onChange={(e) => setContent({...content, subTitle: e.target.value})}/>
          </div>
          <div className="sub-title-item">
            <span>演讲者：</span>
            <input type="text" className="speaker" value={content.speaker}
                   onChange={(e) => setContent({...content, speaker: e.target.value})}/>
          </div>
          <div className="sub-title-item">
            <span>演讲时间：</span>
            <input type="text" className="speaker-time" value={content.speakerTime}
                   onChange={(e) => setContent({...content, speakerTime: e.target.value})}/>
          </div>
        </div>
      </div>
      <DndProvider backend={HTML5Backend}>
        {/*<Left onEndDrag={handleAddCard}/>*/}
        <Right data={treeData} removeNode={removeNode} moveItem={handleMove} changeContent={handleChange}
               clickContent={handleClick} addItem={handleAddCard}/>
      </DndProvider>
      <Modal title="一键生成大纲" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>根据「{content.title}」轻松生成主题大纲，快速构建完美PPT！</p>
      </Modal>
      <ModalLibrary/>
    </div>
  );
};
