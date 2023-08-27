import DashboardItem from "@/features/dashboard-item";
import RecentList from "@/features/recent-list";
import AddDocuments from "@/features/add-document";
import HomeTopBar from "@/features/home-top-bar";
import {FormattedMessage} from "react-intl";
import strings from "@/constants/strings";
import {useContext} from "react";
import {StateContext} from "../context";
import PPTChosen from "../features/ppt/components/PPTChosen";
import PPTImportAI from "../features/ppt/components/PPTImportAI";
import {Col, Row} from "antd";


const PageDesktop = () => {
  const {mine = {}} = useContext(StateContext);
  return (
    <div style={{
      'display': 'flex',
      'flexDirection': 'column',
      'color': '#726D6D'
    }}>
      {
        mine?.language === 'zh' && <HomeTopBar/>
      }
      <h1><FormattedMessage {...strings.DashboardTitle} /></h1>
      <DashboardItem/>
      <Row gutter={[16, 16]}>
        <Col span={12} >
          <h3>精选 PPT</h3>
        </Col>
        <Col span={8} >
          {/*<h3>AI PPT</h3>*/}
        </Col>
      </Row>
      <Row gutter={[16, 16]} align='middle'>
        <Col span={12} >
          <PPTChosen isDashboard={true}/>
        </Col>
        <Col offset={1} span={10} >
          <PPTImportAI />
        </Col>
      </Row>
      <h3><FormattedMessage id="project.document"/></h3>
      <AddDocuments/>
      <h3><FormattedMessage {...strings.DashboardRecent} /></h3>
      <RecentList hasNewBtn={false}/>
    </div>
  );
};
export default PageDesktop;
