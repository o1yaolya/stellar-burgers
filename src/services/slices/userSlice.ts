import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi
} from '../../utils/burger-api';
import { deleteCookie, setCookie } from '../../utils/cookie';

// Состояние пользователя
interface TUserState {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Начальное состояние
const initialState: TUserState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false
};

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  try {
    const token = localStorage.getItem('refreshToken');
    if (!token) {
      return null;
    }
    const response = await getUserApi();
    return response.user;
  } catch (error: any) {
    if (error.message === 'You should be authorised' || error.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    return null;
  }
});

export const autoLogin = createAsyncThunk('user/autoLogin', async () => {
  try {
    const token = localStorage.getItem('refreshToken');
    if (!token) {
      throw new Error('No token found');
    }
    const response = await getUserApi();
    return response.user;
  } catch (error: any) {
    if (error.message === 'You should be authorised' || error.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    throw error;
  }
});

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await loginUserApi({ email, password });
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);
export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const registerUser = createAsyncThunk(
  'user/register',
  async ({
    email,
    password,
    name
  }: {
    email: string;
    password: string;
    name: string;
  }) => {
    const response = await registerUserApi({ email, password, name });
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async ({ email }: { email: string }) => {
    await forgotPasswordApi({ email });
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ password, token }: { password: string; token: string }) => {
    await resetPasswordApi({ password, token });
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: { name?: string; email?: string; password?: string }) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchUser
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        if (action.payload) {
          state.isAuthenticated = true;
        }
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error =
          action.error.message ?? 'Ошибка загрузки данных пользователя';
      })

      // autoLogin
      .addCase(autoLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(autoLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(autoLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.error.message ?? 'Автологин не удался';
      })

      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка входа';
        state.isAuthenticated = false; // Исправлено: было true
      })

      // logoutUser
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка выхода';
      })

      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка регистрации';
      })

      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка обновления данных';
      })

      // forgotPassword
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка восстановления пароля';
      })

      // resetPassword
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка сброса пароля';
      });
  }
});

export default userSlice.reducer;
