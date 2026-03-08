// type for props components
export type FormInputProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  register: any;
  error?: any;
  validation?: object;
};

//type for Register Form
export type RegisterFormData = {
  email: string;
  password: string;
  firstname: string;
  age: number;
  rules: boolean;
  s
};

//type for Login Form
export type LoginFormData = {
  email: string;
  password: string;
};

//type props Modle
export type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
};
//type AuthFormProps
export type AuthFormProps = {
  type: "register" | "login" | "forgot-password"|"reset-password";
  onSubmit: (data: any) => void;
  isPending?: boolean;
  error?: string | null;
  resetForm?: boolean;
  successMessage?: string | null;
   token?: string | null;
};
//type ResetPassword
export type ResetPasswordtype={
  password:string,
  token:string
}
//type ReservAutorent
 export type ReservAutorentType = {
  logo: string;
  firstname: string;
  secondname: string;
  descripton: string;
  id?:number
};
//type feacherWhyAutoRent
 export type feacherWhyAutoRent = {
  name: string;
  logo: string;
  description: string;
  id: number;
};
//type descriptionWhyAutoRenttype
 export type descriptionWhyAutoRenttype={
  logo:string;
  name:string;
  description:string;
  id?: number;
}