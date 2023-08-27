import { Space, Table, Tag } from 'antd';
import {useContext, useEffect, useState} from "react";
import {getAssetById, getAssets} from "../../services/assets";
import {useNavigate} from "react-router-dom";
import {getProject} from "../../services/project";
import {EventContext} from "../../context";
import {saveArticle} from "../../services/document";
import {createRecord} from "../../services/proxy-sync-generate";
const AssetsList = () => {
  const event = useContext(EventContext);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getAssets().then(({ data }) => {
      setData(data.data);
    });
  }, []);
  const onStartClick = async (record) => {
    const asset = await getAssetById(record.id);
    if (asset) {
      getProject({pageSize: 1}).then(({ code, data }) => {
        if (code === 0) {
          const latestProject = data.data[0];
          if (latestProject) {
            saveArticle({
              title: '小红书文案',
              projectId: latestProject.id,
            }).then(({code, data}) => {
              if (code === 0) {
                const documentId = data.id;
                createRecord(70, {
                  streaming: true,
                  body: {
                    text: asset.data,
                  },
                }).then(({ code, data }) => {
                  if (code === 0) {
                    navigate(`/document/${documentId}`, {
                      state: {
                        recordId: data.id
                      }
                    })
                  }
                });
              }
            });
          } else {
            event.emit({
              type: 'add-project',
            });
          }
        }
      });
    }
  };
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => onStartClick(record)}>生成小红书</a>
        </Space>
      ),
    },
  ];
  return (
    <Table columns={columns} dataSource={data} />
  )
};
export default AssetsList;
