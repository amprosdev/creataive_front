import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider} from 'react-router-dom';
import {EventContext, StateContext} from '@/context';
import {GuardProvider} from '@authing/guard-react18';
import {init} from "@/utils/track";
import router from '@/routes';
import reportWebVitals from "@/utils/reportWebVitals";
import '@/assets/common.scss';
import 'normalize.css';
import './index.scss';
import IntlProvider from './components/IntlProvider';

// Replace YOUR_TOKEN with your Project Token
import {ConfigProvider, Spin} from 'antd';
import store from "store";
import {useEventEmitter} from "ahooks";
import {getBrowserLanguage, isMobile} from "./utils/device";
import {identify} from "./utils/track";
import {getUserInfo} from "./services/setting";
import {FormattedMessage} from "react-intl";
import MobileTip from "./features/mobile-tip";
import Loadable from "react-loadable";
import Loading from "./routes/Loading";
import {useResponseInterceptor} from "@/utils/axios";

init();

/**
 * 必须异步支持
 */
const SignIn = Loadable({
  loader: () => import('@/features/sign-in-form'),
  loading: Loading
});

const GuardApp = () => {
  const event$ = useEventEmitter();
  useResponseInterceptor(event$);

  return (
    <EventContext.Provider value={event$}>
      <StateContextBox/>
    </EventContext.Provider>
  )
}
const StateContextBox = () => {
  // 获取用户信息
  const [mine, setMine] = useState({});
  const [org, setOrg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const setOrganization = (organizationId) => {
    store.set('organization', organizationId);
  }
  const setLanguage = (language) => {
    store.set('locale', language);
    const event = new CustomEvent('change-language-event', {
      detail: {
        language
      }
    });
    document.dispatchEvent(event);
  }
  useEffect(() => {

    // 勿删，保留
    // isMobile() || guard.checkLoginStatus().then(user => {
    //   if (user) {
    //     identify(user.data.id);
    //
    //   } else {
    //     setMine(null);
    //     setIsLoading(false);
    //   }
    // });
    isMobile() || getUserInfo().then(({data}) => {
      if (data.code === 0) {
        setMine(data.data);
        identify(data.data.id);
        if (!data.data.language) {
          data.data.language = getBrowserLanguage();
        }
        setLanguage(data.data.language);
        const firstOrg = data.data.organizations[0];
        const orgId = store.get('organization');
        if (orgId) {
          const targetOrg = data.data.organizations.find((item) => orgId === item.id);
          setOrg(targetOrg || firstOrg);
          setOrganization(targetOrg?.id || firstOrg.id);
        } else {
          setOrg(firstOrg);
          setOrganization(firstOrg.id);
        }
      } else {
        setMine(null);
      }
    }).finally(() => {
      setIsLoading(false);
    })
  }, []);
  if (isMobile()) {
    return <MobileTip/>
  }
  if (isLoading) {
    return (
      <Spin tip={<FormattedMessage id="loading.tip"/>} size="large" style={{marginTop: 100}}>
        <div className="content"/>
      </Spin>
    )
  }
  return (
    <StateContext.Provider value={{mine, setMine, org}}>
      <RouterProvider router={router}/>
      {
        !mine && <SignIn/>
      }
    </StateContext.Provider>
  )
}
const App = () => {
  window.addEventListener('error', function (event) {
    // todo 上线前放开错误拦截注释
    // window.location.href = '/error.html'
  })
  return (
    <GuardProvider appId="63c6bee82db7ec890b96bca8" mode="modal">
      <IntlProvider>
        <ConfigProvider theme={{
          token: {
            colorPrimary: '#9667E0',
            screenXL: '1420',
            screenXLMin: '1420',
            screenLGMax: '1419',
            screenMD: '800',
            screenMDMin: '800',
            screenSMMax: '799'
          },
        }}>
          <GuardApp/>
        </ConfigProvider>
      </IntlProvider>
    </GuardProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);

reportWebVitals(console.log);
