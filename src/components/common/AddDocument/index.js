import {useContext, useState} from "react";
import {Modal} from "antd";
import TemplateProduct from "@/components/common/Template";
import { EventContext } from '@/context';
import './index.scss';

export default function AddDocument({ refresh }) {
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState('');
  const event = useContext(EventContext);
  event.useSubscription(({ type, val }) => {
    if (type === 'add-document') {
      setOpen(true);
      setProjectId(val);
    }
  });
  return (
    <>
      <Modal
        open={open}
        title={'Create Document'}
        onCancel={() => setOpen(false)}
        width={560}
        centered={true}
        footer={null}
        // style={{
        //   top: 50,
        // }}
      >
        <div className="add-document-body">
          <TemplateProduct projectId={projectId}/>
        </div>
      </Modal>
    </>
  );
}
