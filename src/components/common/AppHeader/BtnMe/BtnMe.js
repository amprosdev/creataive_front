import {useContext, useRef, useState} from "react";
import {useGuard} from "@authing/guard-react18";
import {CheckOutlined, SettingOutlined} from "@ant-design/icons";
import {useClickAway} from "ahooks";
import {EventContext, StateContext} from "@/context";
import store from "store";
import './index.scss';
import {FormattedMessage} from "react-intl";


const BtnMe = () => {
  const [showPanel, setShowPanel] = useState(false);
  const {mine = {}} = useContext(StateContext);
  const guard = useGuard();
  const event = useContext(EventContext);
  const ref = useRef(null);
  const currentOrg = store.get('organization');
  useClickAway(() => {
    setShowPanel(false);
  }, ref);

  function logout() {
    store.clearAll();
    guard.logout();
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  function toggleShowPanel() {
    setShowPanel(!showPanel)
  }

  function onSettingClick() {
    event.emit({
      type: 'modal-setting',
    });
  }

  const setOrganization = (organizationId) => {
    store.set('organization', organizationId);
    window.location.href = '/';
  }
  return (
    <div ref={ref} className="app-header-btn-me">
      <span className="app-header-icon-me" onClick={toggleShowPanel}>
        {mine.avatar ? <img src={mine.avatar + '?imageMogr2/crop/100x100/gravity/center'} alt=""/> :
          <FormattedMessage id="me"/>}
      </span>
      {
        showPanel &&
        <div className="app-header-me-panel">
          <div className="app-header-me-panel-head">
            <span className="app-header-icon-me">
              {mine.avatar ? <img src={mine.avatar + '?imageMogr2/crop/100x100/gravity/center'} alt=""/> :
                <FormattedMessage id="me"/>}
            </span>
            <span className="app-header-icon-nickname">{mine.nickname}</span>
            <span className="app-header-icon-settings" onClick={onSettingClick}>
              <SettingOutlined/>
            </span>
          </div>
          <div className="app-header-me-panel-orgs">
            {
              mine.organizations.map((org, index) => {
                return (
                  <div
                    className={`app-header-me-panel-orgs-item ${currentOrg === org.id ? 'active' : ''}`}
                    key={index}
                    onClick={() => setOrganization(org.id)}
                  >
                    <CheckOutlined className="app-header-me-panel-orgs-item-check"/>
                    {org.orgName}
                  </div>
                )
              })
            }
          </div>
          <div className="app-header-me-panel-logout" onClick={logout}><FormattedMessage id="menu.logout"/></div>
        </div>
      }
    </div>
  )
}

export default BtnMe;
