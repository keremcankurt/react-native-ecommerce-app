import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import {edit } from "../user/userSlice";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

const loadUserFromStorage = createAsyncThunk('auth/loadUserFromStorage', async () => {
  const user = await AsyncStorage.getItem('user');
  return user ? JSON.parse(user) : null;
});

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    const response = await authService.login(JSON.stringify(user));
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }
    await AsyncStorage.setItem('user',JSON.stringify(result));
    return result;
  } catch (err) {
    Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: err.message,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
    });
    return thunkAPI.rejectWithValue(err.message);
  }
});
export const logout = createAsyncThunk('auth/logout', async (data=null,thunkAPI) => {
  try {
    const response = await authService.logout();
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }
    await AsyncStorage.removeItem('user')
    Toast.show({
        type: 'success',
        text1: 'Logout successfully',
        text2: result.message,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
    });
    return result;
  } catch (error) {
    Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: error.message,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
    });
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
  try {
    const response = await authService.register(JSON.stringify(user));
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }
    Toast.show({
        type: 'success',
        text1: 'registration is successful',
        text2: result.message,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
    });
    return result;
  } catch (error) {
    Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: error.message,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
    });
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotpassword', async (data, thunkAPI) => {
  try {
    const response = await authService.forgotPassword(JSON.stringify(data));
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }
    Toast.show({
        type: 'success',
        text1: 'Forgot Password',
        text2: result.message,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
    });
    return result;
  } catch (error) {
    Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: error.message,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
    });
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const changePassword = createAsyncThunk('auth/changepassword', async (data, thunkAPI) => {
  try {
    const response = await authService.changePassword(JSON.stringify(data));
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }
    Toast.show({
        type: 'success',
        text1: 'Change Password',
        text2: result.message,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
    });
    return result;
  } catch (error) {
    Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: error.message,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
    });
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const confirmAccount = createAsyncThunk('auth/confirmAccount', async (data, thunkAPI) => {
  try {
    const response = await authService.confirmAccount(data);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }
    return result.message;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});


  export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      reset: (state) => {
        state.isError = false;
        state.isSuccess = false;
        state.isLoading = false;
        state.message = "";
      },
      logoutUser: async(state) => {
        state.isError = false;
        state.isSuccess = false;
        state.isLoading = false;
        state.message = "";
        state.user = null;
        await AsyncStorage.removeItem('user')
      },
    },
    extraReducers: (builder) => {
        builder
        .addCase(loadUserFromStorage.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload;
        })
        .addCase(login.pending, (state) => {
          state.isLoading = true
        })
        .addCase(login.fulfilled, (state,action) => {
          state.isLoading = false
          state.user = action.payload;
        })
        .addCase(login.rejected, (state,action) => {
          state.isLoading = false
        })
        .addCase(register.pending, (state) => {
          state.isLoading = true
        })
        .addCase(register.fulfilled, (state,action) => {
          state.isLoading = false
          state.isSuccess = true
        })
        .addCase(register.rejected, (state,action) => {
          state.isLoading = false
        })
        .addCase(forgotPassword.pending, (state) => {
          state.isLoading = true
        })
        .addCase(forgotPassword.fulfilled, (state,action) => {
          state.isLoading = false
          state.isSuccess = true
        })
        .addCase(forgotPassword.rejected, (state,action) => {
          state.isLoading = false
        })
        .addCase(changePassword.pending, (state) => {
          state.isLoading = true
        })
        .addCase(changePassword.fulfilled, (state,action) => {
          state.isLoading = false
          state.isSuccess = true
        })
        .addCase(changePassword.rejected, (state,action) => {
          state.isLoading = false
        })
        .addCase(confirmAccount.pending, (state) => {
          state.isLoading = true
        })
        .addCase(confirmAccount.fulfilled, (state,action) => {
          state.isLoading = false
          state.isSuccess = true
          state.message = action.payload
        })
        .addCase(confirmAccount.rejected, (state,action) => {
          state.isLoading = false
          state.message = action.payload
        })
        .addCase(logout.fulfilled, (state,action) => {
          state.isLoading = false
          state.isSuccess = false
          state.isError = false
          state.message = ""
          state.user = null
        })
        .addCase(edit.fulfilled, async(state,action) => {
          const newUser = {
            name: action.payload.data.name,
            surname: action.payload.data.surname,
            profilePicture: action.payload.data.profilePicture,
            role: action.payload.data.role,
            isSeller: action.payload.data.seller.isSeller
          }
          state.user = newUser
          await AsyncStorage.setItem("user",JSON.stringify(newUser))
        })
    }

});
export { loadUserFromStorage };
export const { reset, logoutUser } = authSlice.actions;
export default authSlice.reducer;