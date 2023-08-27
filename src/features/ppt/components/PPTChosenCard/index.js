import './index.scss';
import {getImageUrl} from "@/utils/ppt";
import dayjs from 'dayjs';

require('dayjs/locale/zh-cn');
const relativeTime = require('dayjs/plugin/relativeTime')
// 设置中文语言环境
dayjs.locale('zh-cn');
dayjs.extend(relativeTime)

const PPTChosenCard = ({ item, onChosenClick }) => {
  return (
    <div className="ppt-chosen-card" onClick={() => onChosenClick(item)}>
      <div className="ppt-chosen-card-bg">
        <img src={getImageUrl(item.image)} alt=""/>
      </div>
      <div className="ppt-chosen-card-title">{item.title}</div>
    </div>
  );
};
export default PPTChosenCard;
