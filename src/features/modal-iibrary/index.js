import {useContext, useEffect, useState} from "react";
// import './index.scss';
import {Divider, List, Modal} from "antd";
import {FormattedMessage} from "react-intl";
import {EventContext} from "@/context";
import ImageUpload from "../library-list/components/ImageUpload";
import ImageItem from "./components/ImageItem";
import InfiniteScroll from "react-infinite-scroll-component";
import {getPictures} from "../../services/library";
import {getProject} from "../../services/project";

export default function ModalContactUs() {
  const [open, setOpen] = useState(false);
  const [pictures, setPictures] = useState([{}]);
  const [projects, setProjects] = useState([]);
  const [picturesTotal, setPicturesTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const event = useContext(EventContext);

  event.useSubscription(({type, callback}) => {
    if (type === 'modal-library') {
      setOpen(true);
    }
  });
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
  const onAdd = (item) => {
    const newData = pictures;
    newData.splice(1, 0, item);
    setPictures(newData);
    setPicturesTotal(picturesTotal + 1)
  }
  const loadMoreData = () => {
    console.log('滚动到底部了');
    if (loading) {
      return;
    }
    setLoading(true);
    loadData(parseInt(pictures.length / 20 + 1)).then(() => {
      setLoading(false);
    });
  };
  const onDel = (id) => {
    const newData = pictures.filter((item) => item.id !== id);
    setPictures(newData);
    setPicturesTotal(picturesTotal - 1)
  }
  const init = () => {
    setPictures([{}]);
    loadData();
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
    getProject({
      pageSize: 100
    }).then((resp) => {
      setProjects(resp.data.data);
    });
  }, []);
  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <Modal
        className="modal-library"
        open={open}
        title={<FormattedMessage id="menu.library"/>}
        footer={null}
        width={'80%'}
        height={'60%'}
        destroyOnClose={true}
        onCancel={() => setOpen(false)}
      >
        <InfiniteScroll
          dataLength={pictures.length}
          next={loadMoreData}
          hasMore={pictures.length < picturesTotal}
          endMessage={pictures.length > 10 ?
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
            dataSource={pictures}
            renderItem={(item, index) => (
              index === 0 ? <List.Item><ImageUpload addData={onAdd}/></List.Item> :
                <List.Item key={item.id}>
                  <ImageItem key={item.id} data={item} projects={projects}
                             editValue={updateJsonArrayById}
                             setOpen={setOpen}
                             delData={onDel}/>
                </List.Item>
            )}
          />
        </InfiniteScroll>
      </Modal>
    </>
  );
}
