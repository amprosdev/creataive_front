import {
  AppstoreOutlined,
  BulbOutlined,
  DeleteOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  PictureOutlined,
  PlusOutlined,
  ProfileOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom'
import {message, Modal} from "antd";
import {useContext, useEffect, useState } from "react";
import {getProject, deleteProject} from "@/services/project";
import {EventContext} from "@/context";

import './index.scss';
import strings from '@/constants/strings';

import {FormattedMessage} from "react-intl";


const DeleteBtn = ({ project, refresh }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleOk = () => {
    deleteProject(project.id).then(resp => {
      message.success('删除成功');
      setOpen(false);
      refresh && refresh();
      navigate('/main/dashboard');
    });
  }
  return (
    <>
      <DeleteOutlined  onClick={(e) => {
        e.stopPropagation();
        setOpen(true)
      }}/>
      <Modal
        open={open}
        onOk={handleOk}
        destroyOnClose={true}
        onCancel={() => setOpen(false)}
      >
        <div><FormattedMessage id="delete.project.warning"/>「{project.name}」?</div>
      </Modal>
    </>
  )
}

const MenuGroup = ({ menu, subMenu = false }) => {
  return (
    <div className='menu-group'>
      {
        menu.map((item, index) => {
          return <MenuItem item={item} subMenu={subMenu} key={index}/>
        })
      }
    </div>
  )
}
const MenuItem = ({item, subMenu}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const jumpTo = ({ path, click }) => {
    path ? navigate(path) : click && click();
  };

  return <div id={item.id} onClick={() => jumpTo(item)}>
    <div className={subMenu ? 'menu-item menu-item-submenu' : 'menu-item'}>
      <span className={item.path === location.pathname ? "menu-item-text menu-item-text-selected" : "menu-item-text"}>
        <i>{item.icon}</i>
        {item.text}
      </span>
      <i className={item.suffixShowOnHover && 'menu-item-suffix'}>{item.suffix}</i>
    </div>
    {
      item.children && <MenuGroup menu={item.children} subMenu={true}/>
    }
  </div>
}

const Menu = () => {
  const event = useContext(EventContext);
  const [menu, setMenu] = useState(buildMenu());
  const [projects, setProjects] = useState([]);
  event.useSubscription(({ type, callback }) => {
    if (type === 'refresh-project') {
      loadData()
    }
  });
  function onNewProjectClick () {
    event.emit({
      type: 'add-project',
    });
  }
  function onSettingClick () {
    event.emit({
      type: 'modal-pricing',
    });
  }
  function buildMenu (projects = [], loadData) {
    return [{
      id: 'menu-dashboard',
      text: <FormattedMessage {...strings.MenuDashboard} />,
      path: '/main/dashboard',
      icon: <AppstoreOutlined />
    }, {
      id: 'menu-project',
      text: <FormattedMessage {...strings.MenuProject} />,
      icon: <FolderOutlined />,
      suffix: <PlusOutlined onClick={onNewProjectClick}/>,
      children: projects.map(project => {
        return {
          text: project.name,
          path: `/main/project/${project.id}`,
          icon: <FolderOpenOutlined />,
          suffix: <DeleteBtn project={project} refresh={loadData}/>,
          suffixShowOnHover: true
        }
      })
    }, {
      id: 'menu-ppt',
      text: <FormattedMessage {...strings.MenuPPT} />,
      path: '/main/ppt',
      // eslint-disable-next-line react/jsx-no-undef
      icon: <ProfileOutlined />,
    }, {
      id: 'menu-library',
      text: <FormattedMessage {...strings.MenuLibrary} />,
      path: '/main/library',
      // eslint-disable-next-line react/jsx-no-undef
      icon: <PictureOutlined />,
    }, {
      id: 'menu-library',
      text: <FormattedMessage {...strings.MenuAssets} />,
      path: '/main/assets',
      // eslint-disable-next-line react/jsx-no-undef
      icon: <ProfileOutlined />,
    }];
  }
  function loadData() {
    getProject().then(({ code, data }) => {
      if (code === 0) {
        setProjects(data.data);
      }
    });
  }
  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    setMenu(buildMenu(projects, loadData));
  }, [projects]);
  return (
      <div className='menu'>
        <div className="menu-main">
          <MenuGroup menu={menu}></MenuGroup>
        </div>
        <div className="menu-settings">
          <div className="menu-upgrade-pro" onClick={onSettingClick}>
            <BulbOutlined style={{marginRight: 5}}/>
            <FormattedMessage {...strings.MenuPro}/>
          </div>
        </div>
      </div>
  );
};
export default Menu;
