import {Col, Row} from 'antd';
import {useNavigate} from "react-router-dom";
import {saveArticle} from '@/services/document';

import './index.scss';
import {useContext, useEffect, useState} from "react";
import {EventContext} from "@/context";
import {getProject} from "../../../services/project";
import {FormattedMessage} from "react-intl";
import titleList from "@/locales/zh.json"

export default function TemplateRow() {
  const event = useContext(EventContext);
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState('');
  const [item, setItem] = useState({});
  const [temporary, setTemporary] = useState({});

  const onTemplateRowClick = ({key, title}) => {
    getProject({pageSize: 1}).then(({ code, data}) => {
      if (code === 0) {
        const latestProject = data.data[0];
        if (latestProject) {
          setProjectId(latestProject.id);
          setItem({key, title});
        } else {
          event.emit({
            type: 'add-project',
          });
          setTemporary({key, title});
        }
      }
    });
  };
  event.useSubscription(({ type }) => {
    if (type === 'add-project-done') {
      onTemplateRowClick(temporary);
    }
  });
  const suggests = [{
    icon: <span className="icon-new-file"></span>,
    title: 'Blank',
    desc: '',
    key: null,
  }, {
    icon: <span className="icon-wechat-file"></span>,
    title: <FormattedMessage id="template.wechat"/>,
    key: 'wechat'
  }, {
    icon: <span className="icon-video-file"></span>,
    title: <FormattedMessage id="template.tiktok"/>,
    key: 'tiktok'
  }, {
    icon: <span className="icon-media-file"></span>,
    title: <FormattedMessage id="template.redbook"/>,
    key: 'redbook'
  }, {
    icon: <span className="icon-branding-file"></span>,
    title: <FormattedMessage id="template.branding"/>,
    key: 'branding'
  }, {
    icon: <span className="icon-more-file"></span>,
    title: <FormattedMessage id="template.more"/>,
    key: 'more'
  }]
  useEffect(() => {
    if(!item.title){
      return;
    }
    if (item.key === 'more') {
      event.emit({
        type: 'modal-contact-us',
        val: 1,
      });
      return;
    }
    saveArticle({
      title: typeof item.title === 'string' ? item.title : titleList[item.title?.props.id],
      projectId,
    }).then(({code, data}) => {
      if (code === 0) {
        navigate(`/document/${data.id}`, {state: { key: item.key }})
      }
    });
  }, [item])
  return (
    <div className="template-row-root">
      <Row gutter={24}>
        {
          suggests.map((item, index) => (
            <Col xs={12} sm={12} md={8} lg={6} xl={4} key={index}>
              <div className="templateRow" onClick={() => onTemplateRowClick(item)} key={index}>
                <div className="templateRow-left">
                  {item.icon}
                </div>
                <div className="templateRow-right">
                  <div className="templateRow-right-title">{item.title}</div>
                </div>
              </div>
            </Col>
          ))
        }
      </Row>
    </div>
  )
};
