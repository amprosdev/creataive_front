import './index.scss';
import BtnLanguage from "./BtnLanguage/BtnLanguage";
import BtnHelp from "./BtnHelp/BtnHelp";
import BtnMe from "./BtnMe/BtnMe";
import {useContext} from "react";
import {StateContext} from "@/context";

const AppHeader = () => {
  const {mine} = useContext(StateContext);
  return (
    <div className="app-header">
      <div className="app-site">
        <img src={require('@/assets/images/creataive-logo.png')} alt=""/>
      </div>
      {
        mine &&
          <div className="app-header-right">
            <BtnLanguage/>
            <BtnHelp/>
            <BtnMe/>
          </div>
      }
    </div>
  )
}

export default AppHeader;
