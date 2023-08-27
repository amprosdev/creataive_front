import {PlusOutlined} from "@ant-design/icons";
import {message, Upload} from "antd";
import {uploadFile} from "@/utils/upload";
import {postPicture} from "@/services/library";
import './index.scss';

export default function ImageUpload({ addData }) {

  const uploadImage = ({ file }) => {
    const ext = file.name.split('.').at(-1);
    uploadFile({file, ext}, (url, id) => {
      postPicture({
        id,
        name: file.name,
        imageUrl: url,
        parentId: null,
      }).then(({ code, data}) => {
        if (code === 0) {
          message.success('上传成功');
          addData(data);
        }
      })
    });
  };
  return (
    <Upload
      customRequest={uploadImage}
      name="image"
      listType="picture-card"
      className="image-upload"
      showUploadList={false}
      multiple={true}
    >
      <PlusOutlined />
    </Upload>
  )
}
