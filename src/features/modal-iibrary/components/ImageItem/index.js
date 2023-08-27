import {useContext, useEffect, useState} from "react";
import {Image, message, Popconfirm} from 'antd';
import {deletePicture} from "@/services/library";
import {ReactComponent as DeleteIcon} from '@/assets/images/icons/delete.svg'
import './index.scss';
import {FormattedMessage} from "react-intl";
import {EventContext} from "@/context";

export default function ImageItem({data, delData, projects, setOpen}) {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState([]);
  const event = useContext(EventContext);
  const deleteImage = () => {
    deletePicture(data.id).then(() => {
      message.success('删除成功');
      delData(data.id);
    })
  };
  const getProjectsByName = (value = '') => {
    const res = projects
      .filter((item) => {
        return item.name.toLowerCase().indexOf(value.toLowerCase()) > -1;
      })
      .map(({id, name}) => ({
        key: id,
        value: id,
        label: name
      }));
    setOptions(res);
  };
  const selectImage = (data) => {
    setOpen(false);
    event.emit({
      type: 'select-image',
      url: data.imageUrl + '?imageMogr2/thumbnail/500x/quality/60',
      name: data.name
    });
  }

  useEffect(() => {
    getProjectsByName();
  }, [projects]);
  return (
    <div className="image-item">
      <div className="image-wrapper" onClick={() => selectImage(data)}>
        <img loading="lazy" src={data.imageUrl + '?imageMogr2/thumbnail/500x/quality/60'} alt=""/>
        <div className="image-mask" onClick={() => setVisible(true)}>
          <div className="image-bottom" onClick={(e) => {
            e.stopPropagation();
          }}>
            <div className="image-bottom-left">
              <div className="image-text">{data.name}</div>
            </div>
            <div className="image-bottom-right">
              <Popconfirm
                title={<FormattedMessage id="library.delPicture.title"/>}
                description={<FormattedMessage id="library.delPicture.description"/>}
                okText={<FormattedMessage id="library.addPicture.yes"/>}
                cancelText={<FormattedMessage id="library.addPicture.no"/>}
                onConfirm={deleteImage}
              >
                <DeleteIcon/>
              </Popconfirm>
            </div>
          </div>
        </div>
      </div>
      <Image
        width={200}
        style={{
          display: 'none',
        }}
        src={data.imageUrl + '?imageMogr2/thumbnail/500x/quality/60'}
      />
    </div>
  )
}
