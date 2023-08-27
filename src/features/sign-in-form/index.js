import {useContext, useEffect, useState} from 'react';
import {useGuard} from '@authing/guard-react18';
import {LANDING_PAGE, SIGN_IN} from "@/constants/mixpanel-events";
import {track} from "@/utils/track";
import {initOrganization} from "@/services/organization";
import {login} from "@/services/setting";
import '@authing/guard-react18/dist/esm/guard.min.css';
import './index.scss';
import {EventContext} from "../../context";
import {FormattedMessage} from "react-intl";
import store from "store";
import {createTrialAccount} from "../../services/setting";

const SignInForm = () => {
  const guard = useGuard();
  const event = useContext(EventContext);
  const [showLoding, setShowLoding] = useState(false);


  const createTrialAccountFn = (res) => {
    createTrialAccount().then((res) => {
      store.set('_authing_token', res.data);
      initOrganization().then((resp) => {
        if (resp.code === 0) {
          window.location.reload();
        }
      });
    })
  }
  guard.on('close', e => {
    setShowLoding(false);
  })
  guard.on('load', e => {
    setTimeout(() => {
      setShowLoding(true);
    }, 180);
  })
  useEffect(() => {
    // 挂载模态框，当用户完成登录之后，你可以获取到用户信息
    guard.start('#authing-guard-container').then((userInfo) => {
      track(SIGN_IN, {
        user_id: userInfo.id,
      });
      track(LANDING_PAGE);
      initOrganization().then((resp) => {
        if (resp.code === 0) {
          window.location.reload();
        }
      });
    });
  }, []);

  const loginFn = async (person) => {
    await login({phone: person}).then((res) => {
      store.set('_authing_token', res.data);
    })
  }
  event.useSubscription(({type, callback}) => {
    if (type === 'show-login') {
      const person = prompt('请输入手机号');
      if (person != null && person !== '') {
        loginFn(person).then(() => {
          window.location.reload();
        })
        // createTrialAccountFn();
      }
      /*if (!guard.visible) {
        guard.show();
      }*/
    }
  });
  return (
    <div className="sign-in-form">
      {/*<div id="authing-guard-container"></div>*/}
      {
        showLoding &&
        <div className="experience-account" onClick={createTrialAccountFn}>
          <FormattedMessage id="experience.account"/>
        </div>
      }
    </div>
  );
}

export default SignInForm;
