import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index'; 

interface User {
  username: string;
}

interface UserWithPassword extends User {
  password?: string;
}

interface Credentials {
  username: string;
  password: string;
}

interface AuthState {
  user: User | null;
  users: UserWithPassword[]; // user database
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  users: [],
  isLoading: false,
  error: null,
};

//Async Thunks

// Handles user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (credentials: Credentials, { getState, rejectWithValue }) => {
    const { users } = (getState() as RootState).auth;
    // Simulate API call
    return new Promise<UserWithPassword>((resolve, _reject) => {
      setTimeout(() => {
        if (users.find(u => u.username.toLowerCase() === credentials.username.toLowerCase())) {
          // Use rejectWithValue to send a specific error payload
          return rejectWithValue('Username already exists.');
        }
        const newUser: UserWithPassword = { username: credentials.username, password: credentials.password };
        resolve(newUser);
      }, 1000);
    });
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: Credentials, { getState, rejectWithValue }) => {
    const { users } = (getState() as RootState).auth;
    // Simulate a delay without the `new Promise` constructor
    await new Promise(resolve => setTimeout(resolve, 800));
    const foundUser = users.find(u => u.username.toLowerCase() === credentials.username.toLowerCase());
    if (foundUser && foundUser.password === credentials.password) {
      const { password: _, ...userWithoutPassword } = foundUser;
      // Simply return the successful value
      return userWithoutPassword;
    } else {
      // Return the rejected value
      return rejectWithValue('Invalid username or password.');
    }
  }
);

//Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  // Handle async actions from thunks
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<UserWithPassword>) => {
        state.isLoading = false;
        state.users.push(action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload; 
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;