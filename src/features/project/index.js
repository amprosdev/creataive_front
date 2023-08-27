import {useContext, useEffect, useState} from "react";
import { PlusOutlined } from '@ant-design/icons';
import DocumentList from '@/features/document-list';
import Button from '@/components/common/Button';
import {useParams} from "react-router-dom";
import {getProjectById} from "@/services/project";
import {EventContext} from "@/context";
import './index.scss';
import {FormattedMessage} from "react-intl";

export default function ProjectList() {
  const [project, setProject] = useState([]);
  const [total, setTotal] = useState(0);
  const event = useContext(EventContext);
  const params = useParams();
  useEffect(() => {
    getProjectById(params.id).then(resp => {
      setProject(resp.data);
    });
  }, [params.id]);
  const handleNew = () => {
    event.emit({
      type: 'add-document',
      val: params.id,
    });
  };
  return (
    <div className="project">
      <div className="project-info">
        <h1>{project.name}</h1>
        { total > 0 && <span className="document-total">{total} <FormattedMessage id="project.documents"/></span> }
        <span className="btn-new-document">
          <Button icon={<PlusOutlined />} onClick={handleNew}><FormattedMessage id="project.document"/></Button>
        </span>
      </div>
      <DocumentList projectId={params.id} total={total} setTotal={setTotal} hasNewBtn={true} onNewClick={handleNew}/>
    </div>
  )
};
