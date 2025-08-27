import { notification, Popconfirm, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaEdit, FaTrash } from "react-icons/fa";
import { GENDER_OPTIONS } from "../../constant/gender";
import useDateFormat from "../../hooks/useDateFormat";
import type { User, UserMeta } from "../../types/user";
import { ROLE_OPTIONS } from "../../constant/role";
import { handleDeleteApi } from "../../config/handleApi";

type UserTableProps = {
  handleOpenDrawer?: (user?: Partial<User>) => void;
  isLoading: boolean;
  users?: User[] | null;
  pagination: UserMeta | null;
  onRefresh?: () => void;
};

const UserTable = ({ handleOpenDrawer, isLoading, users, onRefresh }: UserTableProps) => {
  const data: User[] = Array.isArray(users) ? users : [];

  const handleDelete = async (id: string) => {
    try {
      await handleDeleteApi(`/user/${id}`);
      notification.success({
        message: "Xóa user thành công",
      });
      onRefresh?.();
    } catch (error) {
      notification.error({
        message: "Có lỗi xảy ra",
        description: "Vui lòng thử lại sau",
      });
    }
  };
  const columns: ColumnsType<User> = [
    {
      title: "STT",
      width: 70,
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "Account",
      dataIndex: "account",
    },
    {
      title: "Full name",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Date of birth",
      render: (_text, record) => {
        return <div>{useDateFormat(record.dateOfBirth)}</div>;
      },
    },
    {
      title: "Gender",
      align: "center",
      render: (_text, record) => {
        return GENDER_OPTIONS.find((item) => item.value === record.gender)
          ?.label;
      },
    },
    {
      title: "Role",
      align: "center",
      render: (_text, record) => {
        return ROLE_OPTIONS.find((item) => item.value === record.role)
          ?.label;
      },
    },
    {
      title: "Action",
      align: "center",
      render: (_text, record) => (
        <div className="flex items-center justify-center gap-4">
          <FaEdit
            size={18}
            className="cursor-pointer text-blue-700"
            onClick={() => handleOpenDrawer?.(record)}
          />
          <Popconfirm
            placement="leftTop"
            title={"Xác nhận xóa người dùng?"}
            description={"Bạn có chắc chắn muốn xóa người dùng này?"}
            onConfirm={async () => {
              handleDelete(record.id);
            }}
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <span className="cursor-pointer">
              <FaTrash size={18} className="text-red-600" />
            </span>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      <Table<User>
        loading={isLoading}
        rowKey={(r) => r.id}
        dataSource={data}
        columns={columns}
        bordered
        pagination={false}
      />
    </div>
  );
};

export default UserTable;
