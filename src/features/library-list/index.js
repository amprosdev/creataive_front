import {useEffect, useState} from "react";

import ImageItem from "./components/ImageItem";
import ImagePick from "./components/ImagePick";
import ImageUpload from "./components/ImageUpload";
import ImageGenerate from "./components/ImageGenerate";

import {getProject} from "@/services/project";
import {getPictures} from '@/services/library';
import './index.scss';
import {getEditorPick} from "../../services/library";
import {FormattedMessage} from "react-intl";
import {Divider, List} from "antd";
import InfiniteScroll from "react-infinite-scroll-component";

export default function PictureList() {
  const [pictures, setPictures] = useState([{}]);
  const [projects, setProjects] = useState([]);
  const [picturesTotal, setPicturesTotal] = useState(0);
  const [projectsTotal, setProjectsTotal] = useState(0);
  const [editorPick, setEditorPick] = useState([]);
  const [editorPickTab, setEditorPickTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const formatList = (list = []) => {
    return list.map(item => {
      const originName = item.name.split('.')
      return {
        ...item,
        name: originName[0],
        type: originName[1]
      }
    })
  }
  const loadData = async (current) => {
    await getPictures({
      current: current || 1,
      pageSize: 20,
    }).then(resp => {
      setPictures([...pictures, ...formatList(resp?.data?.data)]);
      setPicturesTotal(resp.data.total);
    });
  };
  const loadEditorPick = async (current) => {
    await getEditorPick({
      current: current || 1,
      pageSize: 20,
    }).then(resp => {
      setEditorPick([...editorPick, ...formatList(resp?.data?.data)]);
      setProjectsTotal(resp.data.total);
    });
  }
  const onSwitchTab = (key) => {
    setEditorPickTab(key);
  };
  const init = () => {
    setPictures([{}]);
    setEditorPick([]);
    if (editorPickTab === 0) {
      loadData();
    } else {
      loadEditorPick();
    }
  }
  const loadMoreData = () => {
    console.log('滚动到底部了');
    if (loading) {
      return;
    }
    setLoading(true);
    if (editorPickTab === 0) {
      loadData(parseInt(pictures.length / 20 + 1)).then(() => {
        setLoading(false);
      });
    } else {
      loadEditorPick(parseInt(editorPick.length / 20 + 1)).then(() => {
        setLoading(false);
      });
    }
  };
  const onDel = (id) => {
    const newData = pictures.filter((item) => item.id !== id);
    setPictures(newData);
    setPicturesTotal(picturesTotal - 1)
  }
  const onAdd = (item) => {
    const newData = pictures;
    newData.splice(1, 0, item);
    setPictures(newData);
    setPicturesTotal(picturesTotal + 1)
  }
  const updateJsonArrayById = (id, field, value) => {
    const updatedArray = pictures.map(obj => {
      if (obj.id === id) {
        return {...obj, [field]: value};
      }
      return obj;
    });
    setPictures(updatedArray);
  };
  useEffect(() => {
    init();
  }, [editorPickTab]);
  useEffect(() => {
    getProject({
      pageSize: 100
    }).then((resp) => {
      setProjects(resp.data.data);
    });
  }, []);

  return (
    <div className='library-list'>
      <div className="library-switch">
        <span className={editorPickTab === 0 ? 'switch-tab active' : 'switch-tab'} onClick={() => onSwitchTab(0)}>
          <FormattedMessage id="library.mine"/>({picturesTotal})
        </span>
        <span className={editorPickTab === 1 ? 'switch-tab active' : 'switch-tab'} onClick={() => onSwitchTab(1)}>
          <FormattedMessage id="library.trending"/>
        </span>
        <ImageGenerate addData={onAdd}/>
      </div>
      <div
        id="scrollableDiv"
        className="scrollable-div"
      >
        <InfiniteScroll
          dataLength={editorPickTab === 0 ? pictures.length : projects.length}
          next={loadMoreData}
          hasMore={(editorPickTab === 0 ? pictures : editorPick).length < (editorPickTab === 0 ? picturesTotal : projectsTotal)}
          endMessage={(editorPickTab === 0 ? pictures : editorPick).length > 10 ?
            <Divider plain><FormattedMessage id="library.bottomLine"/></Divider> : <></>}
          scrollableTarget="scrollableDiv"
          loader={() => {
            console.log('不知道干嘛的，看看打印')
          }}>
          <List
            grid={{
              xs: 1,
              sm: 1,
              md: 2,
              lg: 3,
              xl: 4,
              xxl: 6,
            }}
            dataSource={editorPickTab === 0 ? pictures : editorPick}
            renderItem={(item, index) => (
              editorPickTab === 0 ?
                <>
                  {index === 0 ? <List.Item><ImageUpload addData={onAdd}/></List.Item> :
                    <List.Item key={item.id}>
                      <ImageItem key={item.id} data={item} projects={projects} editValue={updateJsonArrayById}
                                 delData={onDel}/>
                    </List.Item>}
                </>
                :
                <List.Item key={item.id}>
                  <ImagePick key={item.id} data={item}/>
                </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </div>
  )
}
