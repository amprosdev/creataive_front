import {Tour} from 'antd';
import {useEffect, useState} from 'react';
import store from "store";
import {FormattedMessage} from "react-intl";

const UserTour = () => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const idToured = store.get('user-tour');
    if (!idToured) {
      setTimeout(() => {
        setOpen(true);
        store.set('user-tour', 1);
      }, 100)
    }
  }, []);
  const steps = [
    {
      title: <FormattedMessage id="tour.first.title"/>,
      description: <FormattedMessage id="tour.first.describe"/>,
      target: document.getElementById('menu-project'),
      nextButtonProps:{children:<FormattedMessage id="tour.next"/>}
    },
    {
      title: <FormattedMessage id="tour.second.title"/>,
      description: <FormattedMessage id="tour.first.describe"/>,
      target: document.getElementsByClassName('add-document-body')[0],
      nextButtonProps:{children:<FormattedMessage id="tour.finish"/>},
      prevButtonProps:{children:<FormattedMessage id="tour.previous"/>},

    },
  ];
  return (
    <>
      <Tour
        open={open}
        onClose={() => setOpen(false)}
        steps={steps}
        indicatorsRender={(current, total) => (
          <span>
            {current + 1} / {total}
          </span>
        )}
      />
    </>
  );
};
export default UserTour;
