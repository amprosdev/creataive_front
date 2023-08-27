import React, {Component} from 'react';
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import {message} from "antd";


const getCursorPosition = (contentEditableElement) => {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const preSelectionRange = range.cloneRange();
  preSelectionRange.selectNodeContents(contentEditableElement);
  preSelectionRange.setEnd(range.startContainer, range.startOffset);
  return preSelectionRange.toString().length;
};

function setCursorPosition(element, position) {
  try {
    if (!element.isContentEditable) {
      console.error('元素不可编辑');
      return;
    }
    const s = window.getSelection(),
      r = document.createRange();
    r.setStart(element.lastChild || element, position);
    r.setEnd(element.lastChild || element, position);
    s.removeAllRanges();
    s.addRange(r);
    // todo 页面应当滚动到光标位置，但未生效，需要排查问题
    scrollToCursor(element);
  } catch (error) {
    console.log(error);
  }
}

function showArea(event, props) {
  const {add, remove, fnArea, contentType, id, parentId, index, preLength} = props;
  const clientX = event.clientX + 5; // 获取点击事件在视口中的水平位置
  const clientY = window.innerHeight - event.clientY > 222 ? event.clientY : event.clientY - (222 - (window.innerHeight - event.clientY)); // 获取点击事件在视口中的垂直位置
  const addItem = (type = 'text', content = '') => {
    if (preLength) {
      add(parentId, type, content, index + 1);
    }
  }
  const addChild = () => {
    add(id, 'text', '', 0);
  }
  const deleteItem = () => {
    remove(id, parentId);
  }

  fnArea({
    id,
    preLength,
    clientX,
    clientY,
    addItem,
    addChild,
    deleteItem,
    contentType,
  });
  event.stopPropagation();
}

// 获取选中的文本
function getSelectedText() {
  let selectedText = "";
  if (window.getSelection) {
    selectedText = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
    selectedText = document.selection.createRange().text;
  }
  return selectedText;
}

function handleKeyDown(event) {
  const contentEditableElement = event.currentTarget;
  const cursorPosition = getCursorPosition(contentEditableElement);
  const divs = document.querySelectorAll('.item-editor');
  let currentDivIndex = Array.prototype.indexOf.call(divs, event.target);
  const key = event.key;
  if (key === 'ArrowUp' && currentDivIndex > 0 && cursorPosition === 0) {
    currentDivIndex--;
    divs[currentDivIndex].focus();
    event.stopPropagation();
    event.preventDefault();
  } else if (key === 'ArrowDown' && currentDivIndex < divs.length - 1 && cursorPosition === event.target.innerText.length) {
    currentDivIndex++;
    divs[currentDivIndex].focus();
    event.stopPropagation();
    event.preventDefault();
  }
}

function scrollToCursor(element) {
  const range = window.getSelection().getRangeAt(0);
  let scrollTopNub = 0;
  if (range.collapsed && !range.startContainer.textContent) {
    // ContentEditable区域为空且光标位置处于起始位置
    const cursorElement = document.createElement('span');
    cursorElement.innerHTML = '&#8203;'; // 使用零宽空格作为虚拟光标内容
    range.insertNode(cursorElement);

    const rect = cursorElement.getBoundingClientRect();
    const scrollTop = rect.top + element.scrollTop - element.clientHeight / 2;
    cursorElement.parentNode.removeChild(cursorElement); // 移除虚拟光标元素
    scrollTopNub = scrollTop;
  } else {
    // 其他情况下执行原来的滚动策略
    const rect = range.getBoundingClientRect();
    scrollTopNub = rect.top + element.scrollTop - element.clientHeight / 2;
  }
  window.scrollTop = scrollTopNub;
}

class Text extends Component {
  render() {
    const {change, click, remove, add, fnArea} = this.props;
    return <div
      attr-id={this.props.id}
      className={this.props.className}
      attr-content-type={this.props.contentType}
      // style={this.props.children.props.items?.length ? {} : {border: 'none'}}
    >
      <div
        className="editor-bar-box"
        attr-id={this.props.id}
        style={{display: this.props.id === 'markdownRoot' ? 'none' : 'flex'}}
      >
        <div className="add" onClick={event => {
          showArea(event, this.props);
        }}>
          <div className="add-item">
            <PlusOutlined/>
          </div>
        </div>
        <div className="dot"
             onContextMenu={event => {
               showArea(event, this.props);
               console.log('右键');
               event.preventDefault();
             }}
        >
          <div className="dot-item"/>
        </div>
      </div>

      <div
        id={this.props.id}
        attr-parent-id={this.props.parentId}
        attr-index={this.props.index}
        className="item-editor"
        style={{display: this.props.id === 'markdownRoot' ? 'none' : ''}}
        contentEditable
        suppressContentEditableWarning={true}
        onInput={event => {
          scrollToCursor(event.currentTarget);
        }}
        onBlur={event => {
          change(this.props.id, event.target.innerText);
          event.currentTarget.removeEventListener('keydown', handleKeyDown);
        }}
        onFocus={event => {
          event.currentTarget.addEventListener('keydown', handleKeyDown); // 监听键盘事件
        }}
        onClick={event => {
          try {
            if (this.props.item.children.length) {
              click(event.target.id);
            } else {
              click(this.props.parentId);
            }
          } catch (error) {
            console.log(error);
          }
        }}
        onKeyDown={(event) => {
          try {
            const contentEditableElement = event.currentTarget;
            const cursorPosition = getCursorPosition(contentEditableElement);
            const parentNode = event.target.parentNode;
            const index = Array.prototype.indexOf.call(parentNode.parentNode.children, parentNode);
            if (event.key === 'Enter') {
              if (this.props.item.children.length) {
                // 有子节点直接返回
                // todo 如果添加样式，截断的样式问题需要优化
                const newItem = add(this.props.id, 'text', event.target.innerText.substring(cursorPosition), 0);
                change(this.props.id, event.target.innerText.substring(0, cursorPosition));
                setTimeout(() => {
                  setCursorPosition(document.getElementById(newItem.id), 0);
                });
                // 下面判断只能使用event判断，this.props.content更新不及时，只能在blur触发，如果有其他更新方式，可以考虑弃用event
              } else if (!event.target.innerText && this.props.preLength === this.props.index + 1 && this.props.parentId !== 'markdownRoot') {
                // 无子节点，且当前节点是最后一个节点，且无内容
                const parentItem = document.getElementById(this.props.parentId)
                const newItem = add(parentItem.getAttribute('attr-parent-id'), 'text', '', Number(parentItem.getAttribute('attr-index')) + 1);
                remove(this.props.id, this.props.parentId);
                setTimeout(() => {
                  setCursorPosition(document.getElementById(newItem.id), 0);
                })
                console.log('没有内容');
              } else {
                // 无子节点，且当前节点不是最后一个节点，或有内容
                const newItem = add(this.props.parentId, 'text', event.currentTarget.innerText.substring(cursorPosition), index - 1);
                change(this.props.id, event.currentTarget.innerText.substring(0, cursorPosition));
                setTimeout(() => {
                  setCursorPosition(document.getElementById(newItem.id), 0);
                }, 0);
              }
              event.preventDefault();
            } else if (event.key === 'Backspace') {
              // 删除
              if (getSelectedText()) {
              } else if (cursorPosition === 0) {
                if (this.props.children.props.items.length !== 0 || (this.props.parentId === 'markdownRoot' && this.props.preLength === 1)) {
                  // 有子节点，或者是根节点且只有一个子节点
                } else {
                  console.log(parentNode.parentNode.children[index - 1])
                  console.log(this.props);
                  const per = document.getElementById(this.props.parentId).parentNode.children[index - 1];

                  function getPerLastChild(per) {
                    if (per.lastChild && per.getAttribute('attr-content-type') === 'text') {
                      return getPerLastChild(per.lastChild);
                    } else if (per.getAttribute('attr-content-type') === 'image') {
                      console.log('是个图');
                      return false;
                    }
                    return per.id ? per : per.parentNode;
                  }
                  const perLastChild = getPerLastChild(per);
                  if (!perLastChild) {
                    message.warning('前方节点为图片，内容无法合并，需手动删除');
                    return;
                  }
                  const perLastChildCursorIndex = perLastChild.innerText.length;
                  change(perLastChild.id, perLastChild.innerText + event.currentTarget.innerText);
                  remove(this.props.id, this.props.parentId);
                  setTimeout(() => {
                    setCursorPosition(perLastChild, perLastChildCursorIndex);
                  })
                }
                event.preventDefault();
              }
            } else if (event.shiftKey && event.key === 'Tab') {
              // 同时按下了 Shift 键和 Tab 键
              console.log('Shift + Tab 被按下');

              event.preventDefault();
              // 执行你的逻辑代码
            } else if (event.key === 'Tab') {
              const newItem = add(event.target.id, 'text', '', 0);
              // change(event.target.id, event.target.innerText.substring(0, cursorPosition));
              setTimeout(() => {
                setCursorPosition(document.getElementById(newItem.id), 0);
              }, 0);
              event.preventDefault();
            }
          } catch (error) {
            console.log(error);
          }
        }}
        // 内容：${this.props.content}
      >{`${this.props.content}`}</div>
      {this.props.children}
    </div>;
  }
}


function extractImageSrcFromMarkdown(markdown) {
  const regex = /!\[.*?\]\((.*?)\)/;
  const match = markdown.match(regex);
  return match ? match[1] : null;
}

class Image extends Component {
  render() {
    const {remove} = this.props;
    return <div
      attr-id={this.props.id}
      className={this.props.className}
      attr-content-type={this.props.contentType}
      // style={this.props.children.props.items?.length ? {} : {border: 'none'}}
      onMouseMove={event => {
        event.stopPropagation();
        event.preventDefault();
      }}
      onContextMenu={event => {
        showArea(event, this.props);
        console.log('右键');
        event.preventDefault();
      }}
    >
      <div
        className="editor-bar-box"
        attr-id={this.props.id}
        style={{display: this.props.id === 'markdownRoot' ? 'none' : 'flex'}}
      >
        <div className="add" onClick={event => {
          showArea(event, this.props);
        }}>
          <div className="add-item">
            <PlusOutlined/>
          </div>
        </div>
        <div className="dot"
             onContextMenu={event => {
               showArea(event, this.props);
               event.preventDefault();
             }}
        >
          <div className="dot-item"/>
        </div>
      </div>
      <div className="img-item">
        <img src={extractImageSrcFromMarkdown(this.props.content)} alt=""/>
        <span className="img-item-delete" attr-id={this.props.id} onClick={event => {
          remove(this.props.id, this.props.parentId);
        }}>
          <DeleteOutlined/>
        </span>
      </div>
    </div>;
  }
}

export default {Text, Image}
