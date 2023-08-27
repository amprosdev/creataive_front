import { ProTable } from '@ant-design/pro-components';
import { useRef } from 'react';
import { getDocuments } from "@/services/document";

const columns = [
  {
    dataIndex: 'id',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '结果',
    dataIndex: 'text',
    // hideInSearch: true
  },
  {
    title: '开始时间',
    dataIndex: 'createdAt',
    valueType: 'datetime',
    sorter: true,
    hideInSearch: true,
  },
];

const TaskList = () => {
  const formRef = useRef();
  return (
    <ProTable
      columns={columns}
      formRef={formRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        const result = await getDocuments(params);
        const { data, total } = result.data;
        return {
          data,
          total,
          success: true
        }
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 20,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="历史记录"
    ></ProTable>
  );
};
export default TaskList;
