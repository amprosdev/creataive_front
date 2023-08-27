import {message, Upload} from "antd";
import {uploadFile} from "@/utils/upload";
import './index.scss';
import {updateUserInfo} from "../../../services/setting";
import {PlusOutlined} from "@ant-design/icons";

export default function UploadBrandLogo({logoUrl, setLogo}) {

  const uploadImage = ({file}) => {
    if (file.size > Math.pow(1024, 2) * 5) {
      message.error('图片大小不能超过5MB');
      return
    }
    const ext = file.name.split('.').at(-1);
    uploadFile({file, ext}, (url, id) => {
      updateUserInfo({
        userLogo: url,
      }).then(({code, data}) => {
        if (code === 0) {
          setLogo(url);
          message.success('修改成功');
        }
      })
    });
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <Upload
      customRequest={uploadImage}
      name="image"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      multiple={true}
    >
      {
        logoUrl ?
          (
            <img
              src={logoUrl + '?imageMogr2/crop/100x100/gravity/center'}
              alt="avatar"
              style={{
                width: '100%',
              }}
            />
          )
          :
          (
            uploadButton
          )
      }
    </Upload>
  )
}
