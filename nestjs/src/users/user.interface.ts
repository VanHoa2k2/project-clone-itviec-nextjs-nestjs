export interface IUser {
  id: number;
  name: string;
  email: string;
  urlCV: string;
  avatar: string;
  notifies?: {
    id: number;
    status?: string;
    title?: string;
    description?: string;
    createdAt?: string;
  }[];

  role: {
    id: number;
    name: string;
  };

  company?: {
    id: number;
    name: string;
  };

  permissions?: {
    id: number;
    name: string;
    apiPath: string;
    module: string;
  }[];
}
