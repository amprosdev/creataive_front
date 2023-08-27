import {QuestionCircleOutlined} from "@ant-design/icons";
import './index.scss';
const BtnHelp = () => {
  const openHelpCenter = () => {
    window.open('https://zwz9n2v5j5.feishu.cn/wiki/wikcnDOXGfiDpbQOvmZvdu1VNwd');
  };
  return (
    <>
      <QuestionCircleOutlined onClick={openHelpCenter} className="app-header-icon-help"/>
    </>
  )
}

export default BtnHelp;
