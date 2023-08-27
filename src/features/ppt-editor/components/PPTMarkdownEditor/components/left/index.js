import React from 'react';
import SourceBox from './SourceBox';

// 'Text',
const types = ['text'];

export default function Left({onEndDrag}) {
  return (
    <div>
      {
        types.map((type, index) => {
          return (
            <SourceBox name={type} key={index} onEndDrag={onEndDrag}>
              <button>拖拽到任意位置添加</button>
            </SourceBox>
          )
        })
      }
    </div>
  )
}
