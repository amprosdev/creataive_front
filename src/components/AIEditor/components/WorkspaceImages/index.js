import './index.scss';
import {getPictures} from "@/services/library";
import {useEffect, useState} from "react";
import {AppstoreOutlined, CloudUploadOutlined} from "@ant-design/icons";
import {message, Upload} from "antd";

import {uploadFile} from "@/utils/upload";
import {postPicture} from "@/services/library";
import {useNavigate} from "react-router-dom";
import {updatePicture} from "@/services/library";

export default function WorkspaceImages({document = {}, insertImage}) {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const uploadImage = ({file}) => {
    const ext = file.name.split('.').at(-1);
    uploadFile({file, ext}, (url, id) => {
      postPicture({
        id,
        name: file.name,
        imageUrl: url,
        parentId: null,
      }).then(({code, data}) => {
        if (code === 0) {
          setProject(data);
        }
      })
    });
  };
  const goLibrary = () => {
    navigate(`/main/library`)
  }
  const setProject = (imgData) => {
    updatePicture({
      ...imgData,
      parentId: document.projectId
    }).then(resp => {
      console.log(resp)
      init();
      message.success('上传成功');
    })
  };
  const init = () => {
    getPictures({
      parentId: document.projectId,
      pageSize: 100,
    }).then(resp => {
      setImages(resp.data.data)
    });
  }
  useEffect(() => {
    if (document.projectId) {
      init();
    }
  }, [document.projectId]);
  const onImageClick = (src) => {
    insertImage(src);
  }
  return (
    <div className="workspace-images">
      <div className="workspace-images-header">
        <div className="workspace-images-btn" onClick={goLibrary}>
          <AppstoreOutlined/>
          <span>媒体库</span>
        </div>

        <Upload
          customRequest={uploadImage}
          name="image"
          showUploadList={false}
          multiple={true}
        >
          <div className="workspace-images-btn upload">
            <CloudUploadOutlined/>
            <span>上传图片</span>
          </div>
        </Upload>
      </div>
      {
        images.length ?
          (
            images.map(img => {
              return <img
                draggable={false}
                key={img.id}
                className="workspace-images-item"
                src={img.imageUrl}
                alt={img.name}
                onClick={() => onImageClick(img.imageUrl, img.name)}
              />
            })
          ) :

          <div className="no-data">
            <Upload
              customRequest={uploadImage}
              name="image"
              showUploadList={false}
              multiple={true}
            >
              <img src={require('@/assets/images/noData.png')} alt=""/>
              <div className="text">
                <span>暂无可用图片</span>
                <span className="upload">上传图片</span>
              </div>
            </Upload>
          </div>
      }
    </div>
  );
}
