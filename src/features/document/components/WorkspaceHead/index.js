import { LeftOutlined } from '@ant-design/icons';
import {useNavigate} from "react-router-dom";
import './index.scss';
import BtnLanguage from "@/components/common/AppHeader/BtnLanguage/BtnLanguage";
import BtnHelp from "@/components/common/AppHeader/BtnHelp/BtnHelp";
import BtnMe from "@/components/common/AppHeader/BtnMe/BtnMe";
import {Button, Divider, message, Space} from "antd";
import {useContext, useState} from "react";
import {EventContext} from "@/context";
import {FormattedMessage} from "react-intl";
import PPTImportTransfer from "../../../ppt/components/PPTImportTransfer";

export default function WorkspaceHead() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const event = useContext(EventContext);
  const onExportClick = () => {
    setLoading(true);
    event.emit({
      type: 'editor-export-image',
      callback: () => {
        setLoading(false);
      }
    });
  };
  const onSaveClick = () => {
    event.emit({
      type: 'export-save-document',
    });
    message.success('保存成功');
  };
  return (
    <div className="workspace-header">
      <div className="workspace-header-project">
        <LeftOutlined className='btn-back' onClick={() => navigate(-1)}/>
      </div>

      <div className="workspace-header-project-right">
        <Space>
          <PPTImportTransfer></PPTImportTransfer>
          <Button className="btn-save" type="primary" size="small" loading={loading} onClick={onExportClick}>
            <FormattedMessage id="workspace.header.action.export" />
          </Button>
          <Button className="btn-save" type="primary" size="small" onClick={onSaveClick}>
            <FormattedMessage id="workspace.header.action.save" />
          </Button>
        </Space>

        <Divider type="vertical" style={{height:30, margin: 10}}/>
        <BtnLanguage />
        <BtnHelp />
        <BtnMe />
      </div>
    </div>
  );
}
