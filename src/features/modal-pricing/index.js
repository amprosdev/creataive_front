import {useContext, useState} from "react";
import './index.scss';
import {Modal} from "antd";
import {FormattedMessage} from "react-intl";
import Pricing from "@/components/common/Pricing";
import {EventContext} from "@/context";


let _callback;

export default function ModalPricing() {
  const [open, setOpen] = useState(false);
  const event = useContext(EventContext);
  
  event.useSubscription(({ type, callback }) => {
    if (type === 'modal-pricing') {
      setOpen(true);
      _callback = callback
    }
  });
  return (
    <>
      <Modal
        className="modal-pricing"
        open={open}
        title={<FormattedMessage id="menu.pro"/>}
        footer={null}
        width={850}
        onCancel={() => setOpen(false)}
      >
        <Pricing />
      </Modal>
    </>
  );
}
