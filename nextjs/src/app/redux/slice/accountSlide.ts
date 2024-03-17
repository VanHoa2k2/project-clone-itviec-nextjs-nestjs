import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callFetchAccount, handleRefreshToken } from "@/config/api";
import { store } from "../store";

// First, create the thunk
export const fetchAccount = createAsyncThunk(
  "account/fetchAccount",
  async () => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const resFetchAccount = await callFetchAccount();

      // Khi access token hết hạn sẽ gọi hàm handleRefreshToken
      console.log("resFetchAccount", resFetchAccount);
      if (
        resFetchAccount?.statusCode === 401 &&
        resFetchAccount?.error === "Unauthorized"
      ) {
        const resRefreshToken = await handleRefreshToken(); // refresh token để trả về access token mới
        console.log("resRefreshToken", resRefreshToken);
        if (resRefreshToken?.data?.access_token) {
          localStorage.setItem(
            "access_token",
            resRefreshToken?.data?.access_token
          );
          const resFetchAccount = await callFetchAccount();
          if (resFetchAccount?.statusCode === 200) {
            return resFetchAccount?.data;
          }
        }

        if (resRefreshToken?.statusCode === 400) {
          const message =
            resFetchAccount?.message ?? "Có lỗi xảy ra, vui lòng login.";
          //dispatch redux action
          store.dispatch(setRefreshTokenAction({ status: true, message }));
        }
      }
      if (resFetchAccount?.statusCode === 200) {
        return resFetchAccount?.data;
      }
    }
  }
);

interface IState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isRefreshToken: boolean;
  errorRefreshToken: string;
  user: {
    id: number | null;
    email: string;
    name: string;
    urlCV?: string;
    avatar?: string;
    company?: {
      id: number | null;
      name: string;
    };
    role: {
      id: number | null;
      name: string;
    };
    permissions: {
      id: number | null;
      name: string;
      apiPath: string;
      method: string;
      module: string;
    }[];
  };
  activeMenu: string;
}

const initialState: IState = {
  isAuthenticated: false,
  isLoading: true,
  isRefreshToken: false,
  errorRefreshToken: "",
  user: {
    id: null,
    email: "",
    name: "",
    urlCV: "",
    avatar: "",
    company: {
      id: null,
      name: "",
    },
    role: {
      id: null,
      name: "",
    },
    permissions: [],
  },

  activeMenu: "home",
};

export const accountSlide = createSlice({
  name: "account",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setActiveMenu: (state, action) => {
      state.activeMenu = action.payload;
    },
    setUserLoginInfo: (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user.id = action?.payload?.id;
      state.user.email = action.payload.email;
      state.user.name = action.payload.name;
      state.user.urlCV = action?.payload?.urlCV;
      state.user.avatar = action?.payload?.avatar;
      state.user.company = action?.payload?.company;
      state.user.role = action?.payload?.role;
      state.user.permissions = action?.payload?.permissions;
    },
    setLogoutAction: (state, action) => {
      localStorage.removeItem("access_token");
      state.isAuthenticated = false;
      state.user = {
        id: null,
        email: "",
        name: "",
        urlCV: "",
        avatar: "",
        company: {
          id: null,
          name: "",
        },
        role: {
          id: null,
          name: "",
        },
        permissions: [],
      };
    },
    setRefreshTokenAction: (state, action) => {
      state.isRefreshToken = action.payload?.status ?? false;
      state.errorRefreshToken = action.payload?.message ?? "";
    },
  },

  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchAccount.pending, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = false;
        state.isLoading = true;
      }
    });

    builder.addCase(fetchAccount.fulfilled, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = true;
        state.isLoading = false;
        state.user.id = action?.payload?.user?.id;
        state.user.email = action.payload?.user?.email;
        state.user.name = action.payload?.user?.name;
        state.user.company = action.payload?.user?.company;
        state.user.urlCV = action.payload?.user?.urlCV;
        state.user.avatar = action.payload?.user?.avatar;
        state.user.role = action?.payload?.user?.role;
        state.user.permissions = action?.payload?.user?.permissions;
      }
    });

    builder.addCase(fetchAccount.rejected, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = false;
        state.isLoading = false;
      }
    });
  },
});

export const {
  setActiveMenu,
  setUserLoginInfo,
  setLogoutAction,
  setRefreshTokenAction,
} = accountSlide.actions;

export default accountSlide.reducer;
