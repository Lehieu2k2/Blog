import { Button, Drawer, notification } from "antd";
import { useCallback, useRef, useState } from "react";
import { handleCreateApi } from "../../config";
import type { User } from "../../types/user";
import UserForm, { type UserFormHandle, type UserFormValues } from "./Form";

type UserDrawerProps = {
  user?: Partial<User> | null;
  open: boolean;
  onClose: () => void;
  onRefresh?: () => void;
};

const UserDrawer = ({ user, open, onClose, onRefresh }: UserDrawerProps) => {
  const formRef = useRef<UserFormHandle>(null);
  const [loading, setLoading] = useState(false);

  const create = useCallback(
    async (data: UserFormValues) => {
      try {
        await handleCreateApi<User>({
          url: "/user/create",
          data,
          method: "POST",
        });
        notification.success({ message: "Thêm mới tài khoản thành công" });
        onRefresh?.();
        onClose();
      } catch (error) {
        notification.error({
          message: "Lỗi khi thêm mới tài khoản",
          description: "Vui lòng thử lại sau",
        });
      }
    },
    [onClose, onRefresh]
  );

  const update = useCallback(
    async (data: UserFormValues) => {
      if (!user?.id) return;
      try {
        await handleCreateApi<User>({
          url: `/user/${user.id}`,
          data,
          method: "PATCH",
        });
        notification.success({ message: "Cập nhật tài khoản thành công" });
        onRefresh?.();
        onClose();
      } catch (error) {
        notification.error({
          message: "Lỗi khi cập nhật tài khoản",
          description: "Vui lòng thử lại sau",
        });
      }
    },
    [onClose, user?.id, onRefresh]
  );

  const handleSubmit = async () => {
    if (!formRef.current) return;
    setLoading(true);
    try {
      const values = await formRef.current.submitForm();
      const model: UserFormValues = { ...values };
      if (user?.id) {
        await update(model);
      } else {
        await create(model);
      }
    } catch (err) {
      // validation errors already shown by antd Form
    } finally {
      setLoading(false);
    }
  };

  const isEdit = Boolean(user?.id);

  return (
    <Drawer
      width={800}
      title={isEdit ? "Cập nhật tài khoản" : "Thêm mới tài khoản"}
      onClose={onClose}
      open={open}
      destroyOnClose
    >
      <div className="h-full flex flex-col">
        <UserForm ref={formRef} user={user ?? undefined} />
        <div className="mt-auto flex gap-4 justify-end pt-6">
          <Button size="large" onClick={onClose} disabled={loading}>
            Hủy bỏ
          </Button>
          <Button
            size="large"
            onClick={handleSubmit}
            type="primary"
            loading={loading}
          >
            {isEdit ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default UserDrawer;
