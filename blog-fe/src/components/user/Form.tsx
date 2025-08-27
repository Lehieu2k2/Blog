import { DatePicker, Form, Input, Select } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import {
  type ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";
import { GENDER_OPTIONS } from "../../constant/gender";
import { ROLE, ROLE_OPTIONS } from "../../constant/role";
import type { User } from "../../types/user";

export type UserFormValues = {
  account: string;
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  gender: number;
  email: string;
  role: string;
};

// Internal form type with dayjs objects for form fields
type UserFormFields = {
  account: string;
  fullName: string;
  dateOfBirth: Dayjs | null;
  phoneNumber: string;
  gender: number;
  email: string;
  role: string;
};

export type UserFormHandle = {
  submitForm: () => Promise<UserFormValues>;
};

type UserFormProps = {
  user?: Partial<User> | null;
};

const defaultFormValues: UserFormFields = {
  account: "",
  fullName: "",
  phoneNumber: "",
  dateOfBirth: null,
  gender: 0,
  email: "",
  role: ROLE.TYPE_USER,
};

const UserForm = (
  { user }: UserFormProps,
  ref: ForwardedRef<UserFormHandle>
) => {
  const [form] = Form.useForm<UserFormFields>();

  useImperativeHandle(ref, () => ({
    submitForm: async () => {
      const values = await form.validateFields();
      // Convert dayjs date back to string for API
      return {
        ...values,
        dateOfBirth:
          values.dateOfBirth && dayjs.isDayjs(values.dateOfBirth)
            ? values.dateOfBirth.format("YYYY-MM-DD")
            : values.dateOfBirth || "",
      };
    },
  }));

  useEffect(() => {
    const initialValues: UserFormFields = {
      ...defaultFormValues,
      account: user?.account ?? defaultFormValues.account,
      fullName: user?.fullName ?? defaultFormValues.fullName,
      phoneNumber: user?.phoneNumber ?? defaultFormValues.phoneNumber,
      dateOfBirth: user?.dateOfBirth ? dayjs(user.dateOfBirth) : null,
      gender:
        typeof user?.gender === "number"
          ? user?.gender
          : defaultFormValues.gender,
      email: user?.email ?? defaultFormValues.email,
      role: user?.role ?? defaultFormValues.role,
    };
    form.setFieldsValue(initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Form<UserFormFields>
      layout="vertical"
      form={form}
      className="grid grid-cols-3 gap-4"
    >
      <Form.Item<UserFormFields>
        name="account"
        label="Account"
        rules={[{ required: true, message: "Please enter account" }]}
      >
        <Input size="large" placeholder="Account" />
      </Form.Item>

      <Form.Item<UserFormFields>
        name="fullName"
        className="col-span-3"
        label="Full name"
        rules={[{ required: true, message: "Please enter full name" }]}
      >
        <Input size="large" placeholder="Full name" />
      </Form.Item>

      <Form.Item<UserFormFields>
        name="phoneNumber"
        className="col-span-3"
        label="Phone number"
        rules={[{ required: false }]}
      >
        <Input size="large" placeholder="Phone number" />
      </Form.Item>

      <Form.Item<UserFormFields>
        name="dateOfBirth"
        label="Date of birth"
        rules={[{ required: false }]}
      >
        <DatePicker
          size="large"
          placeholder="Date of birth"
          format="YYYY-MM-DD"
          className="w-full"
        />
      </Form.Item>

      <Form.Item<UserFormFields>
        name="gender"
        label="Gender"
        rules={[{ required: false }]}
      >
        <Select size="large" placeholder="Giới tính">
          {GENDER_OPTIONS.map((item) => {
            return (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item<UserFormFields>
        name="role"
        label="Role"
        rules={[{ required: false }]}
      >
        <Select size="large" placeholder="Role">
          {ROLE_OPTIONS.map((item) => {
            return (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item<UserFormFields>
        name="email"
        label="Email"
        rules={[{ required: false }]}
      >
        <Input size="large" placeholder="Email" />
      </Form.Item>
    </Form>
  );
};

export default forwardRef<UserFormHandle, UserFormProps>(UserForm);
