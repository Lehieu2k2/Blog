import { Button } from "antd";
import { useCallback, useState } from "react";
import type { User, UserMeta } from "../../types/user";
import UserDrawer from "./Drawer";
import UserFilter from "./Filter";
import UserTable from "./Table";

interface UserListProps {
  users: User[];
  pagination: UserMeta | null;
  onRefresh?: () => void;
}

const UserList = ({ users, pagination, onRefresh }: UserListProps) => {
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);
  const [isLoading] = useState(false);

  const openDrawer = useCallback((user?: Partial<User>) => {
    setCurrentUser(user ?? null);
    setOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setOpen(false);
    setCurrentUser(null);
  }, []);
  return (
    <>
      <div className="flex flex-col h-full">
        <div className="bg-white p-4 rounded flex justify-between">
          <UserFilter />
          <Button size="large" type="primary" onClick={() => openDrawer()}>
            Thêm mới
          </Button>
        </div>
        <div className="bg-white p-4 rounded mt-4 flex-grow">
          <UserTable
            users={users}
            pagination={pagination}
            isLoading={isLoading}
            handleOpenDrawer={openDrawer}
            onRefresh={onRefresh}
          />
        </div>
        <UserDrawer
          open={open}
          user={currentUser ?? undefined}
          onClose={closeDrawer}
          onRefresh={onRefresh}
        />
      </div>
    </>
  );
};

export default UserList;
