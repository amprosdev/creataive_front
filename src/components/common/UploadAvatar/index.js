import {message, Upload} from "antd";
import {uploadFile} from "@/utils/upload";
import './index.scss';
import {updateUserInfo} from "../../../services/setting";

export default function UploadAvatar({avatarUrl, setAvatar}) {

  const uploadImage = ({file}) => {
    if (file.size > Math.pow(1024, 2) * 5) {
      message.error('头像文件超过5MB');
      return
    }
    const ext = file.name.split('.').at(-1);
    uploadFile({file, ext}, (url, id) => {
      updateUserInfo({
        avatar: url,
      }).then(({code, data}) => {
        if (code === 0) {
          setAvatar(url);
          message.success('修改成功');
        }
      })
    });
  };
  return (
    <Upload
      customRequest={uploadImage}
      name="image"
      listType="picture-card"
      className="upload-avatar"
      showUploadList={false}
      multiple={true}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl + '?imageMogr2/crop/100x100/gravity/center'}
          alt="avatar"
          style={{
            width: '100%',
          }}
        />
      ) : (
        <div>
          ME
        </div>
      )}
    </Upload>
  )
}
