import {BulbOutlined} from "@ant-design/icons";
import './index.scss';
import {FormattedMessage} from "react-intl";

export default function PlaceholderEmpty({ onNewClick, hasNewBtn = true} ) {
  return (
    <div className="placeholder-empty">
      <BulbOutlined style={{fontSize: 40}}/>
      <div className="placeholder-empty-text">
        {hasNewBtn ? <FormattedMessage id="project.empty"/> : <FormattedMessage id="project.empty"/> }
        {hasNewBtn && <span className="placeholder-empty-start" onClick={onNewClick}> <FormattedMessage id="dashboard.create"/></span>}
      </div>
    </div>
  )
};
