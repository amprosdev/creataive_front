import './index.scss';
import {useContext} from "react";
import {EventContext} from '@/context';
import {getProject} from "../../services/project";
import {FormattedMessage} from "react-intl";
import strings from "@/constants/strings";

export default function DashboardItem() {
  const event = useContext(EventContext);

  const onStartClick = () => {
    getProject({pageSize: 1}).then(({ code, data }) => {
      if (code === 0) {
        const latestProject = data.data[0];
        if (latestProject) {
          event.emit({
            type: 'add-document',
            val: latestProject.id,
          });
        } else {
          event.emit({
            type: 'add-project',
          });
        }
      }
    });
  };

  return (
    <div className="dashboard-item">
      <div className="dashboard-item-text">
        <FormattedMessage {...strings.DashboardWelcome} />
        <span className="dashboard-item-start" onClick={onStartClick}>
          <FormattedMessage {...strings.DashboardCreate} />
        </span>
      </div>
    </div>
  )
}
