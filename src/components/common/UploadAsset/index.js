import {Button, message, Upload} from "antd";
import {uploadBasic} from "@/utils/upload";
import './index.scss';
import {UploadOutlined} from "@ant-design/icons";
import {createAsset} from "../../../services/assets";
import store from "store";

export default function UploadAsset() {
  let token = store.get('_authing_token');
  let organizationId = store.get('organization');
  const props = {
    name: 'file',
    action: 'https://api.creataive.net/api/upload/aws',
    headers: {
      Authorization: `${token}`,
      Organization: organizationId
    },
    maxCount: 1,
    showUploadList: false,
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        console.log(info)
        const { data } = info.file.response;
        createAsset({
          url: data.Location,
          bucket: data.Bucket,
          key: data.Key,
          name: info.file.name,
          size: info.file.size,
          type: info.file.type,
        }).then(({code}) => {
          if (code === 0) {
            message.success(`${info.file.name} file uploaded successfully`);
            window.location.reload();
          }
        })
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>点击上传</Button>
    </Upload>
  )
}
