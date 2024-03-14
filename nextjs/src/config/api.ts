import {
  IAccount,
  IBackendRes,
  ICompany,
  IGetAccount,
  IJob,
  IModelPaginate,
  IPermission,
  IResume,
  IRole,
  IUser,
} from "@/types/backend";
import { Mutex } from "async-mutex";
import { revalidateTag } from "next/cache";

const mutex = new Mutex();

interface AccessTokenResponse {
  access_token: string;
}

export const callRegister = async (data: IUser) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/auth/register`,
    {
      method: "POST",
      body: JSON.stringify({
        ...data,
        age: +data.age,
        role: {
          id: 226,
        },
      }),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IUser>;
};

export const callLogin = async (username: string, password: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/auth/login`,
    {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      credentials: "include",
    }
  );
  return (await res.json()) as IBackendRes<IAccount>;
};

export const callFetchAccount = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/auth/account`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IGetAccount>;
};

export const handleRefreshToken =
  async (): Promise<IBackendRes<AccessTokenResponse> | null> => {
    return await mutex.runExclusive(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/auth/refresh`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            credentials: "include",
          }
        );
        const data = await res.json();
        return data;
      } catch (error) {
        console.error("Error refreshing token:", error);
        return null;
      }
    });
  };

export const callLogout = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/auth/logout`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<string>;
};

// module company

export const callFetchCompany = async (query: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/companies?${query}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IModelPaginate<ICompany>>;
};

export const callFetchCompanyById = async (id: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/companies/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<ICompany>;
};

export const callCreateCompany = async (
  name: string,
  address: string,
  description: string,
  logo: string
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/companies`,
    {
      method: "POST",
      body: JSON.stringify({
        name,
        address,
        description,
        logo,
      }),
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<ICompany>;
};

export const callUpdateCompany = async (
  id: number,
  name: string,
  address: string,
  description: string,
  logo: string
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/companies/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        id,
        name,
        address,
        description,
        logo,
      }),
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<ICompany>;
};

export const callDeleteCompany = async (id: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/companies/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<ICompany>;
};

// module user
export const callFetchUser = async (query: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/users?${query}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IModelPaginate<IUser>>;
};

export const callFetchUserById = async (id: number | null) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/users/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IUser>;
};

export const callCreateUser = async (user: IUser) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/users`,
    {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IUser>;
};

export const callUpdateUser = async (user: IUser) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/users`,
    {
      method: "PATCH",
      body: JSON.stringify(user),
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return (await res.json()) as IBackendRes<IUser>;
};

export const callUpdateCVByUser = async (urlCV: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/users/upload-cv`,
    {
      method: "PATCH",
      body: JSON.stringify({ urlCV }),
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IUser>;
};

export const callDeleteUser = async (id: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/users/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IUser>;
};

// Upload single file
export const callUploadSingleFile = async (file: any, folderType: string) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileUpload", file);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/files/upload`,
    {
      method: "POST",
      body: bodyFormData,
      headers: {
        folder_type: folderType,
      },
    }
  );
  return (await res.json()) as IBackendRes<{ fileName: string }>;
};

// module job
export const callCreateJob = async (job: IJob) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/jobs`,
    {
      method: "POST",
      body: JSON.stringify(job),
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IJob>;
};

export const callFetchJobById = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/jobs/${id}`,
    {
      method: "GET",

      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IJob>;
};

export const callUpdateJob = async (job: IJob, id: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/jobs/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(job),
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IJob>;
};

export const callFetchJob = async (query: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/jobs?${query}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IModelPaginate<IJob>>;
};

export const callDeleteJob = async (id: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/jobs/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IJob>;
};

export const callGetJobsSuggestByCv = async (
  query: string,
  fileName: string | undefined
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/jobs/jobs-suggest?${query}`,
    {
      method: "POST",
      body: JSON.stringify({ fileName }),
      headers: {
        // Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IModelPaginate<IJob>>;
};

// module resume

export const callCreateResume = async (
  url: string | undefined,
  companyId: any,
  jobId: any
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/resumes`,
    {
      method: "POST",
      body: JSON.stringify({
        url,
        companyId,
        jobId,
      }),
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IResume>;
};

export const UploadCVByUser = async (url: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/resumes/upload-cv`,
    {
      method: "POST",
      body: JSON.stringify({
        url,
      }),
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IResume>;
};

export const callFetchResume = async (query: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/resumes?${query}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IModelPaginate<IResume>>;
};

export const callFetchResumeByUser = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/resumes/by-user`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IResume[]>;
};

export const callUpdateResumeStatus = async (id: number, status: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/resumes/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IResume>;
};

export const callDeleteResume = async (id: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/resumes/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IResume>;
};

// module permission

export const callCreatePermission = async (permission: IPermission) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/permissions`,
    {
      method: "POST",
      body: JSON.stringify(permission),
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IPermission>;
};

export const callFetchPermission = async (query: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/permissions?${query}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IModelPaginate<IPermission>>;
};

export const callUpdatePermission = async (
  permission: IPermission,
  id: number
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/permissions/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(permission),
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IPermission>;
};

export const callDeletePermission = async (id: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/permissions/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IPermission>;
};

// module role

export const callCreateRole = async (role: IRole) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/roles`,
    {
      method: "POST",
      body: JSON.stringify(role),
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IRole>;
};

export const callFetchRole = async (query: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/roles?${query}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IModelPaginate<IRole>>;
};

export const callFetchRoleById = async (id: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/roles/${id}`,
    {
      method: "GET",

      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IRole>;
};

export const callUpdateRole = async (role: IRole, id: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/roles/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(role),
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IRole>;
};

export const callDeleteRole = async (id: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/roles/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return (await res.json()) as IBackendRes<IRole>;
};
