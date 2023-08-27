import {useParams} from "react-router-dom";
import WorkspaceHead from "./components/WorkspaceHead";
import AIEditor from "@/components/AIEditor";
import './index.scss';
export default function Document() {
  const params = useParams();
  return (
      <div className="workspace">
        <div className='workspace-header-wrapper'>
          <WorkspaceHead />
        </div>
        <div className="workspace-shell">
          <div className="workspace-editor-wrapper">
            <AIEditor id={params.id}/>
          </div>
        </div>
      </div>
  );
}
