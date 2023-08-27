import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Item from './item';

const TreeComponent = observer(class Tree extends Component {
  render() {
    const {parentId, items, move, change, click, remove, add, fnArea} = this.props;
    return (
      <>
        {items && items.length
          ? items.map((item, index) => {
            return <Item preLength={items.length} index={index} parentId={parentId} key={item.id} item={item} move={move} change={change} click={click}
                         remove={remove} add={add} fnArea={fnArea}/>;
          })
          : null}
      </>
    );
  }
});

export default TreeComponent;
