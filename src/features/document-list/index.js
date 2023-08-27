import {useEffect, useState} from "react";
import {getDocuments} from "@/services/document";
import DocumentCard from "@/components/common/DocumentCard";
import PlaceholderEmpty from "@/components/common/PlaceholderEmpty";
import {Skeleton} from "antd";
import './index.scss';
import InfiniteScroll from "react-infinite-scroll-component";

export default function DocumentList({projectId, total, setTotal, hasNewBtn = false, onNewClick}) {
  const [data, setData] = useState([]);
  const [curTotal, setCurTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setCurrent(1);
    setData([]);
  }, [projectId]);
  useEffect(() => {
    if (!data.length) {
      getListData();
    }
  }, [data.length]);
  useEffect(() => {
    getListData();
  }, [current]);
  const getListData = async () => {
    setIsLoading(true);
    await getDocuments({
      current,
      pageSize: 10,
      projectId,
    }).then(resp => {
      setData([...data, ...resp.data.data]);
      setIsLoading(false)
      setTotal && setTotal(resp.data.total);
      // todo 首页取不到数据
      setCurTotal(resp.data.total);
    });
  }
  const onDel = (id) => {
    setData((prevState) => prevState.filter((item) => item.id !== id));
  }
  const loadMoreData = () => {
    console.log('滚动到底部了');
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    setCurrent(current + 1);
  }
  return (
    <>
      {
        isLoading && current === 1 ? <Skeleton/>
          :
          <div id="scrollableDiv"
               className="scrollable-div">
            <InfiniteScroll
              dataLength={data.length}
              next={loadMoreData}
              hasMore={data.length < curTotal}
              loader={
                <Skeleton/>
              }
              scrollableTarget="scrollableDiv"
            >
              {data.map(item => {
                return <DocumentCard key={item.id} del={onDel} data={item}/>
              })}
              {data.length === 0 && <PlaceholderEmpty hasNewBtn={hasNewBtn} onNewClick={onNewClick}/>}

            </InfiniteScroll>
          </div>
      }
    </>
  )
};
