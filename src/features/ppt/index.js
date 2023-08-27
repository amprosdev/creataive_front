import './index.scss';
import {useEffect, useState} from "react";
import {List, Space} from "antd";
import {getPPTList} from "@/services/ppt";
import PPTCard from "./components/PPTCard";
import PPTChosen from "./components/PPTChosen";
import PPTImportMarkdown from "./components/PPTImportMarkdown";
import PPTImportMarkdownAI from "./components/PPTImportMarkdownAI";



const PPT = () => {
  const [list, setList] = useState([]);
  useEffect(() => {
    getPPTList().then(({ data }) => {
      setList(data.data)
    });
  }, []);

  const onDelete = (data) => {
    setList((prevState) => prevState.filter((item) => item.id !== data.id));
  };
  return (
    <div className="ppt">
      <div className="ppt-head">
        <h3>精选模版</h3>
        <Space>
          <PPTImportMarkdown />
          <PPTImportMarkdownAI />
        </Space>
      </div>
      <PPTChosen />
      <h3>最近修改</h3>
      <div className="ppt-my-slides">
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={list}
          renderItem={(item, index) => (
            <List.Item>
              <PPTCard key={index} item={item} onDelete={onDelete}/>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};
export default PPT;
