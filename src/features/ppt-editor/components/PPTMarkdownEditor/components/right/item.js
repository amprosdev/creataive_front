import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {observer} from 'mobx-react';
import {DragSource, DropTarget} from 'react-dnd';

import List from './list';
import Components from './components';

function checkIdExists(jsonString, targetId) {
  let idExists = false;

  function traverse(data) {
    if (Array.isArray(data)) {
      data.forEach(item => traverse(item));
    } else if (typeof data === 'object') {
      if (data.hasOwnProperty('id') && data.id === targetId) {
        idExists = true;
        return;
      }
      Object.values(data).forEach(value => traverse(value));
    }
  }

  traverse(jsonString);

  return idExists;
}

const source = {
  /**
   * 拖拽前为组件增加一些属性
   * @param {*} props
   */
  beginDrag(props) {
    const {parentId, item} = props;
    const {id, contentType, children} = item;
    return {
      id,
      parentId,
      contentType,
      items: children
    };
  },

  /**
   * 限制组件是否可拖拽
   * @param {*} props
   */
  canDrag(props) {
    if (props.item.id === 'markdownRoot') return false;
    return true;
  },

  /**
   * 当前组件是否处于拖拽中
   * @param {*} props
   * @param {*} monitor
   */
  isDragging(props, monitor) {
    return props.item.id === monitor.getItem().id;
  },

  /**
   * 我们认为当一个组件停止拖拽时移动中的位置都是在查找合适的的位置，只有在停止的时候才是它真正想要放置的位置
   * @param {*} props
   * @param {*} monitor
   */
  endDrag(props, monitor) {
    const result = monitor.getDropResult();
    if (result?.dragItem) {
      const {dragItem, overItem} = result;
      props.move(dragItem, overItem);
    }
  }
};

function sourceCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

const target = {
  /**
   * 是否可以将拖拽的元素放置
   * @param {*} props
   * @param {*} monitor
   */
  canDrop(props, monitor) {
    // 在此处可以获取到拖拽的组件类型，从而增加一些是否可以放置的条件
    // const dragType = monitor.getItem().type;
    // // 放置的组件类型
    // const dropType = props.item.type;
    return true;
  },

  /**
   * 当前组件是否处于拖拽中
   * @param props
   * @param monitor
   */

  hover(props, monitor) {
    if (props.parentId === null) return;
    const didDrop = monitor.didDrop();
    if (didDrop) {
      return undefined;
    }
  },

  /**
   * 使用drop而未使用hover是不想一直更改数据结构
   * @param {*} props
   * @param {*} monitor
   */
  drop(props, monitor) {
    if (props.parentId === null) return;
    const didDrop = monitor.didDrop();
    if (didDrop) {
      return undefined;
    }
    const {id: draggedId, parentId: dragParentId, items: dragItem} = monitor.getItem();
    const {parentId: overParentId} = props;
    const {id: overId} = props.item;
    if (draggedId) {
      if (draggedId === overId || draggedId === overParentId || overParentId === null || checkIdExists(dragItem, overParentId)) return undefined;
      return {
        dragItem: {draggedId, dragParentId},
        overItem: {overId, overParentId}
      };
    }
    return {id: overId};
  }
};

function targetCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver({shallow: true}),
    canDrop: monitor.canDrop()
  };
}

const ItemComponent = observer(class Item extends Component {
  render() {
    const {
      connectDropTarget,
      connectDragSource,
      canDrop,
      isOver,
      item,
      move,
      change,
      click,
      remove,
      add,
      fnArea,
      parentId,
      index,
      preLength,
    } = this.props;
    const {id, children, content, contentType} = item;

    function capitalizeFirstLetter(str) {
      const [firstChar, ...rest] = str;
      return `${firstChar.toUpperCase()}${rest.join('')}`;
    }

    const CurrentComponet = Components[capitalizeFirstLetter(contentType)];

    const classes = (canDrop && isOver) ? 'activeHover' : '';

    return (
      <CurrentComponet
        index={index}
        parentId={parentId}
        id={id}
        contentType={contentType}
        className={`markdown-item ${classes} item_${item.contentType}`}
        content={content}
        change={change}
        click={click}
        remove={remove}
        add={add}
        fnArea={fnArea}
        item={item}
        preLength={preLength}
        ref={instance => {
          try {
            if (!instance) {
              return;
            }
            // eslint-disable-next-line
            const node = findDOMNode(instance);
            connectDragSource(node.children[0].children[1]);
            connectDropTarget(node);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        <List
          parentId={id}
          items={children}
          move={move}
          change={change}
          click={click}
          remove={remove}
          add={add}
          fnArea={fnArea}
        />
      </CurrentComponet>
    );
  }
});

export default DropTarget('ITEM', target, targetCollect)(DragSource('ITEM', source, sourceCollect)(ItemComponent));
