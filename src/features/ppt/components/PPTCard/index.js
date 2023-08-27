import './index.scss';
import {Dropdown} from "antd";
import {getImageUrl} from "@/utils/ppt";
import dayjs from 'dayjs';
import {EllipsisOutlined} from "@ant-design/icons";
import {createPPT, deletePPTById} from "../../../../services/ppt";

require('dayjs/locale/zh-cn');
const relativeTime = require('dayjs/plugin/relativeTime')
// 设置中文语言环境
dayjs.locale('zh-cn');
dayjs.extend(relativeTime)

const PPTCard = ({ item, onDelete }) => {
  const goToDetail = (id) => {
    window.location.href = `/ppt-editor/${id}`;
  };
  const onClick = ({ domEvent, key}) => {
    domEvent.stopPropagation();
    if (key === '0') {
      window.open(`/ppt-preview/${item.id}`);
    } else if (key === '1') {
      createPPT({
        title: '副本 - ' + item.title,
        themeId: item.themeId,
        templateId: item.templateId,
        subTitle: item.subTitle,
        speaker: item.speaker,
        speakerTime: item.speakerTime,
        docTree: item.docTree,
        docContent: item.docContent,
      }).then(({ data }) => {
        goToDetail(data.id);
      });
    } else if (key === '2') {
      deletePPTById(item.id).then(() => {
        onDelete(item);
      });
    }
  }
  const items = [
    {
      label: '演示',
      key: '0',
    },
    {
      label: '复制',
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: '删除',
      danger: true,
      key: '2',
    },
  ];
  return (
    <div className="ppt-card" onClick={() => goToDetail(item.id)}>
      <Dropdown
        menu={{
          items,
          onClick,
        }}
        trigger={['click']}
      >
        <EllipsisOutlined className="ppt-card-options" onClick={(e) => e.stopPropagation()}/>
      </Dropdown>
      <div className="ppt-card-bg">
        <img src={getImageUrl(item.image)} alt=""/>
      </div>
      <div className="ppt-card-title">{item.title}</div>
      <div className="ppt-card-updated">{dayjs(item.updatedAt).fromNow()}</div>
    </div>
  );
};
export default PPTCard;
