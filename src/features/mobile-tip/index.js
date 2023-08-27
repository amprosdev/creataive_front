import {FormattedMessage} from "react-intl";
import pcImg from "@/assets/images/icons/computer.png";
import mobileImg from "@/assets/images/icons/iphone.png";
import rightArrowImg from "@/assets/images/icons/right-arrow.png";

const PageTip = () => {

  const tipBoxStyle = {
    display: 'flex',
    background: '#000000',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    flexDirection: 'column'
  };
  const iconBoxStyle = {
    display: 'flex',
    marginTop: 'calc(50vh - 100px)',
    alignItems: 'center'
  };
  const tipIconPCStyle = {
    width: 100,
    height: 100
  }
  const tipIconMobileStyle = {
    width: 65,
    height: 65
  }
  const tipIconRAStyle = {
    width: 36,
    height: 36
  }
  return (
    <div style={tipBoxStyle}>
      <div style={iconBoxStyle}>
        <img src={mobileImg} style={tipIconMobileStyle} alt=""/>
        <img src={rightArrowImg} style={tipIconRAStyle} alt=""/>
        <img src={pcImg} style={tipIconPCStyle} alt=""/>
      </div>
      <span style={{color: "#D9BAFF", marginTop: 14, width: 285, textAlign: 'center'}}><FormattedMessage
        id="tip.ua"/></span>
    </div>
  );
};
export default PageTip;
