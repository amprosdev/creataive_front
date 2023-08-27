import {CaretDownOutlined} from '@ant-design/icons'
import {useEffect, useState} from "react";
import {Image, message, Popconfirm, Dropdown} from 'antd';
import {deletePicture, updatePicture} from "@/services/library";
import {ReactComponent as DeleteIcon} from '@/assets/images/icons/delete.svg'
import './index.scss';
import {FormattedMessage} from "react-intl";

export default function ImageItem({data, delData, editValue, projects}) {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState([]);
  const deleteImage = () => {
    deletePicture(data.id).then(() => {
      message.success('删除成功');
      delData(data.id);
    })
  };
  const onSelect = ({key}) => {
    updatePicture({
      ...data,
      parentId: key
    }).then(resp => {
      editValue(data.id, 'parentId', key)
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
  const getProjectNameById = (id) => {
    const project = projects.filter(item => item.id === parseInt(id))[0] || {};
    return project.name;
  };

  useEffect(() => {
    getProjectsByName();
  }, [projects]);
  return (
    <div className="image-item">
      <div className="image-wrapper">
        <img loading="lazy" src={data.imageUrl + '?imageMogr2/thumbnail/500x/quality/60'} alt=""/>
        <div className="image-mask" onClick={() => setVisible(true)}>
          <div className="image-bottom" onClick={(e) => {
            e.stopPropagation();
          }}>
            <div className="image-bottom-left">
              <div className="image-text">{data.name}</div>
              <Dropdown
                menu={{
                  items: options,
                  onClick: onSelect
                }}
                getPopupContainer={e => {
                  return e?.parentNode?.parentNode
                }}
              ><span>
                {getProjectNameById(data.parentId) || <FormattedMessage id="library.select"/>}
                <CaretDownOutlined/>
              </span>
              </Dropdown>
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
        preview={{
          visible,
          src: data.imageUrl + '?imageMogr2/thumbnail/1000x/quality/60',
          onVisibleChange: (value) => {
            setVisible(value);
          },
        }}
      />
    </div>
  )
}
