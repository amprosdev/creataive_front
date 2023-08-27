import {useNavigate} from "react-router-dom";
import {saveArticle} from '@/services/document';

import './index.scss';
import {useContext} from "react";
import {EventContext} from "@/context";
import {FormattedMessage} from "react-intl";
import titleList from "@/locales/zh.json"

export default function TemplateP({projectId}) {

  const event = useContext(EventContext);
  const navigate = useNavigate();

  const onTemplateClick = ({key, title}) => {
    if (key === 'more') {
      event.emit({
        type: 'modal-contact-us',
        val: 1,
      });
      return;
    }
    saveArticle({
      title: typeof title === 'string'? title : titleList[title.props.id],
      projectId,
    }).then(({code, data}) => {
      if (code === 0) {
        navigate(`/document/${data.id}`, {state: {key}})
      }
    });
  };
  const suggests = [{
    icon: <span className="btn-new-file"></span>,
    title: 'Blank',
    desc: '',
    key: null,
  }, {
    icon: <span className="btn-wechat-file"></span>,
    title: <FormattedMessage id="template.wechat"/>,
    key: 'wechat'
  }, {
    icon: <span className="btn-video-file"></span>,
    title: <FormattedMessage id="template.tiktok"/>,
    key: 'tiktok'
  }, {
    icon: <span className="btn-media-file"></span>,
    title: <FormattedMessage id="template.redbook"/>,
    key: 'redbook'
  }, {
    icon: <span className="btn-sku-file"></span>,
    title: <FormattedMessage id="template.sku"/>,
    key: 'sku'
  }, {
    icon: <span className="btn-branding-file"></span>,
    title: <FormattedMessage id="template.branding"/>,
    key: 'branding'
  }, {
    icon: <span className="btn-more-file"></span>,
    title: <FormattedMessage id="template.more"/>,
    key: 'more'
  }]
  return (
    <div className="template-root">
      {
        suggests.map((item, index) => (
          <div className="template" onClick={() => onTemplateClick(item)} key={index}>
            <div className="template-left">
              {item.icon}
            </div>
            <div className="template-right">
              <div className="template-right-title">{item.title}</div>
            </div>
          </div>
        ))
      }
    </div>
  )
};
