import './index.scss';
import { LeftOutlined, CloudSyncOutlined } from '@ant-design/icons';
import {useNavigate, useParams} from "react-router-dom";
import BtnLanguage from "@/components/common/AppHeader/BtnLanguage/BtnLanguage";
import BtnHelp from "@/components/common/AppHeader/BtnHelp/BtnHelp";
import BtnMe from "@/components/common/AppHeader/BtnMe/BtnMe";
import {Button, Divider, message, Space, Tooltip} from "antd";

export default function PPTHead() {
  const navigate = useNavigate();
  const params = useParams();
  const onPreview = () => {
    document.getElementsByClassName('fsbutton')[0].click();
  }
  const onDownloadClick = () => {
    window.location.href = `/ppt-preview/${params.id}?print-pdf`;
  }
  return (
    <div className="ppt-header">
      <div className="ppt-header-project" onClick={() => navigate(-1)}>
        <LeftOutlined className='btn-back'/>
        返回
      </div>
      <div className="ppt-header-project-right">
        <Space>
          <Tooltip title="支持自动保存">
            <span style={{fontSize: 12, marginRight: 20}}>
              <CloudSyncOutlined />
              已保存
            </span>
          </Tooltip>
          <Button size="small" onClick={onDownloadClick}>下载</Button>
          <Button size="small" type="primary" onClick={onPreview}>演示</Button>
        </Space>
        <Divider type="vertical" style={{height:30, margin: 10}}/>
        <BtnLanguage />
        <BtnHelp />
        <BtnMe />
      </div>
    </div>
  );
}
