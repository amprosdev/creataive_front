import {useContext, useState} from "react";
import './index.scss';
import {Modal, Tabs, Select, message, Input, Table, Button} from "antd";
import {EventContext, StateContext} from "@/context";
import {FormattedMessage} from "react-intl";
import InfoItem from '@/components/common/InfoItem';
import UploadAvatar from "@/components/common/UploadAvatar";
import UploadBrandLogo from "@/components/common/UploadBrandLogo";
import Pricing from "@/components/common/Pricing";
import {LogoutOutlined} from '@ant-design/icons';
import {useGuard} from "@authing/guard-react18";
import {
  updateUserInfo,
  updateOrganizationsInfo,
  getOrganizationsInfo,
  updateOrganizationsUser
} from "@/services/setting";
import store from "store";
import {findIndexById} from "@/utils/tool";

const currentOrg = store.get('organization');

export default function SettingModal() {
  const [open, setOpen] = useState(false);
  const [member, setMember] = useState([]);
  const event = useContext(EventContext);
  const {mine = {}, setMine} = useContext(StateContext);

  event.useSubscription(({type, callback}) => {
    if (type === 'modal-setting') {
      setOpen(true);
    }
  });

  function changeUserInfo(key, value) {
    const params = {};
    params[key] = value
    updateUserInfo(params).then(({code}) => {
      if (code === 0) {
        setMine({...mine, ...params})
      }
    })
  }

  function changeOrganizationsInfo(key, value) {
    let params = {data: {}, id: ''};
    params.data[key] = value;
    params.id = currentOrg;
    updateOrganizationsInfo(params).then(({code}) => {
      if (code === 0) {
        const org = mine.organizations;
        const curIndex = findIndexById(mine.organizations, currentOrg)
        org[curIndex] = {...org[curIndex], ...params.data};
        setMine({...mine, ...org});
      }
    })
  }


  function getOrganizationsInfoFn() {
    getOrganizationsInfo(currentOrg).then(({data}) => {
      setMember(data.users);
    })
  }

  function tabChange(item) {
    if (item === 'organization') {
      getOrganizationsInfoFn();
    }
  }

  const UserInfoItems = [
    {
      label: <FormattedMessage id="setting.dialog.account.phone"/>,
      value: (
        <Input value={mine.phone} disabled={true}></Input>
      ),
    },
    {
      label: <FormattedMessage id="setting.dialog.account.username"/>,
      value: (
        <Input defaultValue={mine.nickname} onBlur={(e) => changeUserInfo('nickname', e.target.value)}></Input>
      ),
    },
  ];

  const UserInfo = UserInfoItems.map((item, index) => {
    return (
      <InfoItem key={index} label={item.label} value={item.value}></InfoItem>
    );
  });

  // 修改语言
  const changeLanguage = (language) => {
    const event = new CustomEvent('change-language-event', {
      detail: {
        language
      }
    });
    document.dispatchEvent(event);
    updateUserInfo({
      language,
    }).then(({code, data}) => {
      if (code === 0) {
        // 同步远端后，更新本地缓存
        setMine({...mine, language});
      }
    })
  }

  const GeneralInfoItems = [
    {
      label: <FormattedMessage id="setting.dialog.account.lang"/>,
      value: (
        <div className="text-icon-wrapper">
          {
            mine.language && <Select
              defaultValue={mine.language}
              style={{width: 120}}
              onChange={changeLanguage}
              options={[
                {value: 'en', label: 'English'},
                {value: 'zh', label: '简体中文'},
              ]}
            />
          }
        </div>
      )
    }
  ]
  const GeneralInfo = (
    <div className="general-info-wrapper">
      <div className="title">
        {<FormattedMessage id="setting.dialog.account.general"/>}
      </div>
      {GeneralInfoItems.map((item, index) => {
        return (
          <InfoItem key={index} label={item.label} value={item.value}></InfoItem>
        );
      })}
    </div>
  );


  const BrandShowItems = [
    {
      label: <FormattedMessage id="setting.dialog.account.logo"/>,
      value: (
        <UploadBrandLogo logoUrl={mine.userLogo} setLogo={(logoUrl) => setMine({...mine, userLogo: logoUrl})}/>
      )
    },
    {
      label: <FormattedMessage id="setting.dialog.account.sign"/>,
      value: (
        <Input maxLength="20" value={mine.userSign}
               onChange={(e) => changeUserInfo('userSign', e.target.value)}></Input>
      ),
    }
  ]
  const BrandShow = (
    <div className="general-info-wrapper">
      <div className="title">
        {<FormattedMessage id="setting.dialog.account.brand"/>}
      </div>
      {BrandShowItems.map((item, index) => {
        return (
          <InfoItem key={index} label={item.label} value={item.value}></InfoItem>
        );
      })}
    </div>
  );

  function countByKeyValue(arr, value) {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]?.organization_users?.userType === value) {
        count++;
      }
    }
    return count;
  }

  const handleChange = (item, value) => {
    if (item.organization_users.userType === 0) {
      if (countByKeyValue(member, 0) === 1) {
        message.warning('至少保留一个组织所有者。');
        return;
      }
    }
    updateOrganizationsUser({id: item.organization_users.id, userType: value}).then(({data}) => {
      console.log(data);
    })
  };
  const addMember = () => {
    console.log('添加成员');
    event.emit({
      type: 'modal-contact-us',
      val: 4,
    });
  };
  const columns = [
    {
      title: <FormattedMessage id="setting.organization.table.name"/>,
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: <FormattedMessage id="setting.organization.table.phone"/>,
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: <FormattedMessage id="setting.organization.table.accessLevel"/>,
      key: 'id',
      render: (_, record) => (
        <>
          <Select
            defaultValue={record.organization_users.userType}
            style={{width: 120}}
            disabled={member[findIndexById(member, mine.id)]?.organization_users.userType === 2}
            onChange={(value) => {
              handleChange(record, value)
            }}
            options={[
              {value: 0, label: <FormattedMessage id="setting.organization.table.accessLevel.own"/>},
              {value: 1, label: <FormattedMessage id="setting.organization.table.accessLevel.admin"/>},
              {value: 2, label: <FormattedMessage id="setting.organization.table.accessLevel.member"/>},
            ]}
          />
        </>
      ),
    },
  ];
  const items = [
    {
      key: 'account',
      label: 'setting.dialog.account',
      children: (
        <div className="setting-account-wrapper">
          <div className="account">
            {<FormattedMessage id="setting.dialog.account.title"/>}
          </div>
          <UploadAvatar avatarUrl={mine.avatar} setAvatar={(avatar) => setMine({...mine, avatar})}/>
          {UserInfo}
          {GeneralInfo}
          {BrandShow}
        </div>
      ),
    },
    {
      key: 'organization',
      label: 'setting.dialog.organization',
      children: (
        <div className="setting-organization-wrapper">
          <span className="setting-organization-wrapper-title">{<FormattedMessage
            id="setting.organization.title"/>}</span>
          <div className="info">
            <div className="info-item">
              <div className="label">{<FormattedMessage id="setting.organization.name"/>}</div>
              <span>
                {
                  <Input
                    disabled={member[findIndexById(member, mine.id)]?.organization_users.userType === 2}
                    defaultValue={mine.organizations[findIndexById(mine.organizations, currentOrg)]?.orgName}
                    onBlur={(e) => changeOrganizationsInfo('orgName', e.target.value)}></Input>
                }
              </span>
            </div>
          </div>
          <span className="setting-organization-wrapper-title">{<FormattedMessage
            id="setting.organization.members"/>}</span>
          <div className="setting-organization-wrapper-list">
            <Table columns={columns} dataSource={member} rowKey={'id'}/>
          </div>
          {member[findIndexById(member, mine.id)]?.organization_users.userType === 2 &&
            <div className="setting-organization-wrapper-bottom">
              <Button onClick={addMember}>
                + <FormattedMessage id="setting.organization.members"/>
              </Button>
            </div>
          }
        </div>
      ),
    },
    {
      key: 'plans',
      label: 'setting.dialog.plans',
      children: (
        <div className="plans-wrapper">
          <Pricing/>
        </div>
      ),
    },
  ];

  function logout() {
    store.clearAll()
    guard.logout();
  }

  const guard = useGuard();
  const LogoutText = (
    <div className="logout-wrapper" onClick={logout}>
      <LogoutOutlined/>
      <span className="text"><FormattedMessage id="menu.logout"/></span>
    </div>
  );

  return (
    <>
      <Modal
        className="modal-settings"
        open={open}
        title={<FormattedMessage id="setting.dialog.title"/>}
        footer={null}
        width={900}
        onCancel={() => setOpen(false)}
        destroyOnClose={true}
      >
        <Tabs
          defaultActiveKey="1"
          tabBarStyle={{
            width: 120
          }}
          onChange={tabChange}
          items={items.map(item => {
            return {
              label: <FormattedMessage id={item.label}/>,
              key: item.key,
              children: item.children,
            };
          })}
          tabPosition="left"/>
        {LogoutText}
      </Modal>
    </>
  );
}
