import {GlobalOutlined} from "@ant-design/icons";
import {Dropdown} from "antd";
import {useContext} from "react";
import {StateContext} from "@/context";
import {updateUserInfo} from "@/services/setting";
import './index.scss'
import {FormattedMessage} from "react-intl";

const BtnLanguage = () => {
  const { mine = {}, setMine } = useContext(StateContext);
  const changeLanguage = (language) => {
    const event = new CustomEvent('change-language-event', {
      detail: {
        language
      }
    });
    document.dispatchEvent(event);
    updateUserInfo({
      language,
    }).then(({ code, data }) => {
      if (code === 0) {
        // 同步远端后，更新本地缓存
        setMine({ ...mine, language});
      }
    })
  };
  return (
    <Dropdown
      menu={{
        items: [{
          key: 'zh',
          label: '中文',
          onClick: () => changeLanguage('zh')
        }, {
          key: 'en',
          label: 'English',
          onClick: () => changeLanguage('en')
        }],
        selectable: true,
        defaultSelectedKeys: [mine.language]
      }}
      destroyPopupOnHide={true}
    >
      <GlobalOutlined className="app-header-icon-language"/>
    </Dropdown>
  )
}

export default BtnLanguage;
