import type { AxiosRequestConfig } from "axios";
import type { Tloading } from "./GenralDTO";

export type ApiThunkParams = {
  name: string;
  url: string;
  method?: AxiosRequestConfig["method"];
}

export type TLoginData = {
  email: string;
  password: string;
};
export type TVerifyData = {
  phone?: string;
  token?:string;
  reset_token?:string;
  email_or_phone?:string;
};

export type TloginWithPhoneData = {
  phone: string;
  password:string
}
export type TRegisturePhoneData = {
  phone: string;
  password:string;
  first_name:string;
  last_name:string;
}
export type TVerifyrespone = {
  token: string;
  message: string;
  status: boolean;
  temporary_token?:string|null;
};
export type TOtpState={

    OTPToken:string|null;
    statue:boolean;
    PhoneVerified:boolean;
  
    loading:Tloading;
    error:string|null;
}

export type TUser = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
};

export type TResponse = {
  accessToken: string;
  user: TUser;
};

export type TotpPhone={
  message:"success"|"failed",
  Userexists?:boolean,
  token:"active"|null
}

export type  Tformdata={

    firstname:string
    lastname:string
    email:string
    password:string
}

export type Tauthstate={

    accsessToken:string|null;
    users:{

        id:number;
        firstname:string;
        lastname:string;
        email:string
    }|null
    loading: Tloading
    error:string|null;
}