import {useContext} from "react";
import {EventContext} from "@/context";
import ModalBrandingUser from "@/features/modal-branding-user";
import ModalBrandingCompany from "@/features/modal-branding-company";
import './index.scss';

const HomeTopBar = () => {

  const event = useContext(EventContext);
  const openBrandingUser = () => {
    event.emit({
      type: 'modal-branding-user',
    });
  };
  const openBrandingCompany = () => {
    event.emit({
      type: 'modal-branding-company',
    });
  };
  return (
    <div className='home-top-bar'>
      <p>📣 我们更新了 <span onClick={openBrandingUser} className="purple">建立个人 IP</span> 和 <span
        className="purple" onClick={openBrandingCompany}>打造企业品牌</span> 的模版，快来体验吧 </p>
      <ModalBrandingUser/>
      <ModalBrandingCompany/>
    </div>
  );
};
export default HomeTopBar;
