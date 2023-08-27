import {useState} from "react";
import dayjs from 'dayjs';
import {deleteDocumentById} from "@/services/document";
import './index.scss';
import {DeleteOutlined} from "@ant-design/icons";
import {Modal} from "antd";
import {useNavigate} from "react-router-dom";
import {FormattedMessage} from "react-intl";

export default function DocumentCard({data, del, showProject}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const handleDelete = () => {
    deleteDocumentById(data.id).then(() => {
      setOpen(false);
      setDeleting(true);
      setTimeout(() => {
        del(data.id);
      }, 600);
    });
  };
  const jumpToDetail = () => {
    // console.log(e.target);
    navigate(`/document/${data.id}`);
  };
  const onDeleteClick = (e) => {
    e.stopPropagation();
    setOpen(true);
  }
  const clearNbsp = (val) => {
    if (val)
      return val.replace(/\s&nbsp;/g, '').replace(/&nbsp;/gi, '')
  }
  return (
    <>
      <div className={`document-card ${deleting && 'deleting'}`} onClick={jumpToDetail}>
        <div className="document-card-top">
          <div className="document-card-title">{data.title}</div>
          <span className="document-card-actions">
            <span className="document-card-date">{dayjs(data.updatedAt).format('YYYY-MM-DD HH:mm')}</span>
            <DeleteOutlined
              className='document-card-delete'
              onClick={onDeleteClick}
            />
          </span>
        </div>
        <div className="document-card-body">
          <div className="document-card-body-left">
            {
              data.summary && <div className="document-card-summary">{clearNbsp(data.summary)}</div>
            }
          </div>
          {
            data.gallery && <div className="document-card-gallery">
              <img src={data.gallery} alt=""/>
            </div>
          }
        </div>
        {(data.project && showProject) && <span className="project-name">{data.project?.name}</span>}
      </div>

      <Modal
        open={open}
        onOk={handleDelete}
        onCancel={() => setOpen(false)}
      >
        <p><FormattedMessage id="delete.document.warning"/></p>
      </Modal>
    </>
  )
};
