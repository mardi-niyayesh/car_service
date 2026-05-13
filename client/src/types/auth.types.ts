export type FormInputProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  register: any;
  error?: any;
  validation?: object;
};

export type RegisterFormData = {
  email: string;
  password: string;
  firstname: string;
  age: number;
  rules: boolean;
};

export type LoginFormData = {
  email: string;
  password: string;
};

export type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
};

export type AuthFormProps = {
  type: "register" | "login" | "forgot-password" | "reset-password";
  onSubmit: (data: any) => void;
  isPending?: boolean;
  error?: string | null;
  resetForm?: boolean;
  successMessage?: string | null;
  token?: string | null;
};

export type ResetPasswordtype = {
  password: string;
  token: string;
};

export type ReservAutorentType = {
  logo: string;
  firstname: string;
  secondname: string;
  descripton: string;
  id?: number;
};

export type feacherWhyAutoRent = {
  name: string;
  logo: string;
  description: string;
  id: number;
};

export type descriptionWhyAutoRenttype = {
  logo: string;
  name: string;
  description: string;
  id?: number;
};

export type User = {
  id:string,
  display_name: string;
  email: string;
  age: number;
  roles: string;
  permissions: string[];
};

export type AuthButtonsProps = {
  isMobile?: boolean;
  onClose?: () => void;
};

export type UserContextType = {
  user: User | null;
  token: string | null;
  setUser: (userData: User | null) => void;
  setToken: (newToken: string | null) => void;
  logout: () => void;
  isLoading?: boolean;
  hasPermission?: (perm: string) => boolean;
  hasRole: (roleName: string) => boolean;
};

export type RefreshResponse = {
  accessToken: string;
  user: User;
};
