export interface IBackendRes<T> {
  error?: string | string[];
  message: string;
  statusCode: number | string;
  data?: T;
}

export interface IUser {
  id?: number;
  name: string;
  email: string;
  password?: string;
  age: number;
  gender: string;
  address: string;
  urlCV: string;
  role?: {
    id: number;
    name?: string;
  };

  company?: {
    id: number;
    name?: string;
  };
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAccount {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    urlCV: string;
    company?: {
      id: number;
      name: string;
    };
    role: {
      id: number;
      name: string;
    };
    permissions: {
      id: number;
      name: string;
      apiPath: string;
      method: string;
      module: string;
    }[];
  };
}

export interface IGetAccount extends Omit<IAccount, "access_token"> {}

export interface IModelPaginate<T> {
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: T[];
}

export interface ICompany {
  id?: number;
  name?: string;
  address?: string;
  logo: string;
  description?: string;
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IJob {
  id?: number;
  name: string;
  skills: {
    id: number;
    name: string;
  }[];
  company?: {
    id: number;
    name: string;
    logo?: string;
  };
  location: string;
  salary: number;
  quantity: number;
  level: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IResume {
  id?: number;
  email: string;
  userId: string;
  url: string;
  status: string;
  company: {
    id: number;
    name: string;
    logo: string;
  };
  job: {
    id: number;
    name: string;
  };
  history?: {
    status: string;
    updatedAt: Date;
    updatedBy: { id: string; email: string };
  }[];
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPermission {
  id?: number;
  name?: string;
  apiPath?: string;
  method?: string;
  module?: string;

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRole {
  id?: number | null;
  name: string;
  description: string;
  isActive: boolean;
  permissions: IPermission[] | number[];

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}
