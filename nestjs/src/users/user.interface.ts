export interface IUser {
  id: number;
  name: string;
  email: string;
  urlCV: string;
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
