import './index.scss';
import {List} from "antd";
import PPTChosenCard from "../PPTChosenCard";
import {useEffect, useState} from "react";
import {getChosenList} from '@/services/ppt';
import {createPPTByChosen} from "../../../../services/ppt";

const PPTChosen = ({ isDashboard }) => {
  const [chosenList, setChosenList] = useState([])
  useEffect(() => {
    getChosenList().then(({ data }) => {
      setChosenList(data.data);
    });
  }, []);
  const goToDetail = (id) => {
    window.location.href = `/ppt-editor/${id}`
  }
  const onChosenClick = (item) => {
    createPPTByChosen({
      chosenId: item.id,
    }).then(({ data }) => {
      goToDetail(data.id);
    })
  }
  const grid = isDashboard ? {
    gutter: 16,
    xs: 2,
    sm: 3,
    md: 3,
    lg: 3,
    xl: 3,
    xxl: 3,
  } : {
    gutter: 16,
    xs: 2,
    sm: 3,
    md: 4,
    lg: 6,
    xl: 6,
    xxl: 6,
  }
  return (
    <div className="ppt-my-slides">
      <List
        grid={grid}
        dataSource={chosenList}
        renderItem={(item, index) => (
          <List.Item>
            <PPTChosenCard key={index} item={item} onChosenClick={onChosenClick}/>
          </List.Item>
        )}
      />
    </div>
  );
};
export default PPTChosen;
