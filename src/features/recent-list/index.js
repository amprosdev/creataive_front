import {useEffect, useState} from "react";
import {getDocuments} from "@/services/document";
import DocumentCard from "@/components/common/DocumentCard";
import PlaceholderEmpty from "@/components/common/PlaceholderEmpty";
import {Skeleton} from "antd";
import './index.scss';

export default function DocumentList({projectId, setTotal, hasNewBtn = false, onNewClick}) {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setList([]);
  }, []);
  const getListData = async () => {
    setIsLoading(true);
    await getDocuments({
      current: 1,
      pageSize: 5,
      projectId,
    }).then(({ code, data }) => {
      if (code === 0) {
        setList([...list, ...data.data]);
        setTotal && setTotal(data.total);
      }
      setIsLoading(false)
    });
  }
  const onDel = (id) => {
    const newData = list.filter((item) => item.id !== id);
    setList(newData);
  }

  useEffect(() => {
    if (!list.length) {
      getListData();
    }
  }, []);
  return (
    <>
      {
        isLoading ? <Skeleton/>
          :
          <>
              {list.map(item => {
                return <DocumentCard key={item.id} del={onDel} data={item} showProject={true}/>
              })}
              {list.length === 0 && <PlaceholderEmpty hasNewBtn={hasNewBtn} onNewClick={onNewClick}/>}
          </>
      }
    </>
  )
};
