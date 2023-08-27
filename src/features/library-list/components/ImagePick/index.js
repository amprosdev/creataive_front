import { PlusOutlined, InfoCircleOutlined } from "@ant-design/icons";
import {useState} from "react";
import {Image,Popconfirm, message} from 'antd';
import {postPicture} from "@/services/library";
import { randomString } from '@/utils/upload'
import './index.scss';
import {FormattedMessage} from "react-intl";

export default function ImagePick({data }) {
  const [visible, setVisible] = useState(false);
  const addImage = () => {
    postPicture({
      ...data,
      parentId: null,
      id: randomString()
    }).then(() => {
      message.success('添加成功');
    })
  }
  return (
    <div className="image-pick">
      <div className="image-wrapper">
        <img src={data.imageUrl + '?imageMogr2/thumbnail/500x/quality/60'} alt=""/>
        <div className="image-mask" onClick={() => setVisible(true)}>
          <div className="image-bottom" onClick={(e) => {
              e.stopPropagation();
            }}>
            <div className="image-name">
              <div className="image-text">{data.name}</div>
              <div className="image-add">
                <Popconfirm
                  title={<FormattedMessage id="library.addPicture.title"/>}
                  description={<FormattedMessage id="library.addPicture.description"/>}
                  onConfirm={addImage}
                  icon={<InfoCircleOutlined style={{color: '#1677ff'}} />}
                  okText={<FormattedMessage id="library.addPicture.yes"/>}
                  cancelText={<FormattedMessage id="library.addPicture.no"/>}
                >
                  <PlusOutlined />
                </Popconfirm>
              </div>
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
