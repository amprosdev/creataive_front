import './index.scss';
import {message, Popconfirm} from "antd";
import {deleteProject} from "../../services";

export default function FileItem({ refresh, item }) {
  const onClick = (e) => {
    window.location.href = window.location.origin + `/main/project/${item.id}`;
    // window.open(window.location.origin + `/document/${item.id}`, '_blank', );
  };
  const confirm = (e) => {
    e.stopPropagation();
    deleteProject(item.id).then(resp => {
      message.success('删除成功');
      refresh();
    });
  };
  const cancel = (e) => {
    e.stopPropagation();
  };
  return (
    <div className="file-item" onClick={onClick}>
      <Popconfirm
        title="删除此项目"
        description="确定要删除此项目吗？一旦删除无法恢复"
        onConfirm={confirm}
        onCancel={cancel}
        okText="确认"
        cancelText="取消"
      >
        <i className="file-dustbin" onClick={(e) => e.stopPropagation()}></i>
      </Popconfirm>
      <i className="file-image"></i>
      <div>{item.name}</div>
    </div>
  );
}
