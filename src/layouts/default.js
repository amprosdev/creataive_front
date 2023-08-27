import {Outlet} from 'react-router-dom';
import {useDebounce} from 'ahooks';
import React, {useCallback, useContext, useEffect, useState} from "react";
import {Content, Header} from "antd/es/layout/layout";
import {Layout} from "antd";
import Sider from "antd/es/layout/Sider";
import Menu from '@/components/common/Menu';
import AddDocument from "@/components/common/AddDocument";
import AddProject from "@/components/common/AddProject";
import AppHeader from "@/components/common/AppHeader";
import UserTour from "@/components/UserTour";
import ModalSettings from "@/features/modal-settings";
import ModalPricing from "@/features/modal-pricing";
import ModalContactUs from "@/features/modal-contact-us";
import ModalBindPhone from "@/features/modal-bind-phone";
import {EventContext, StateContext} from "@/context";

export default function RootLayout() {
  const {mine} = useContext(StateContext);

  const event = useContext(EventContext);
  const [contentStyle, setContentStyle] = useState({
    height: window.innerHeight - 60,
    overflow: 'auto',
    padding: 20,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: '#F5F5F5',
    minWidth: 510
  });
  const debouncedContentStyle = useDebounce(contentStyle, {wait: 500});
  const resizeHandler = useCallback(() => {
    const newStyle = Object.assign({}, contentStyle);
    newStyle.height = window.innerHeight - 60;
    setContentStyle(newStyle);
  }, [contentStyle]);
  useEffect(() => {
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [resizeHandler])
  const headerStyle = {
    color: '#fff',
    height: 54,
    lineHeight: '54px',
    paddingInline: 0,
    backgroundColor: '#fff',
  };

  const siderStyle = {
    backgroundColor: '#F5F5F5',
  };
  event.useSubscription(({type, callback}) => {
    if (type === 'execution-queue') {
      console.log('接受到队列了');
      setTimeout(() => {
        callback();
      }, 1000)
    }
  });
  return (
    <>
      <Layout>
        <Header style={headerStyle}><AppHeader/></Header>
        <Layout>
          <Sider style={siderStyle}>
            <Menu/>
          </Sider>
          <Content style={debouncedContentStyle}>
            <Outlet/>
          </Content>
        </Layout>
      </Layout>
      <AddDocument/>
      <AddProject/>
      <ModalPricing/>
      <ModalContactUs/>
      <ModalBindPhone/>
      {
        mine &&
        (
          <>
            <ModalSettings/>
            <UserTour/>
          </>
        )
      }
    </>
  );
}
