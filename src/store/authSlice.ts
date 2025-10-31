import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';
import { jwtDecode } from 'jwt-decode';
import { encode } from 'base-64';

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
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  users: UserWithPassword[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}
interface DecodedToken extends User {
  iat: number; //Issued At
  exp: number; //Expiration Time
}

//Initial State
const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  users: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
};

//Mock JWT Functions
const createFakeJWT = (payload: User): string => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const expiration = Math.floor(Date.now() / 1000) + 60;
  const fullPayload = { ...payload, iat: Math.floor(Date.now() / 1000), exp: expiration };

  const urlSafeEncode = (str: string) =>
    str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  const encodedHeader = urlSafeEncode(encode(JSON.stringify(header)));
  const encodedPayload = urlSafeEncode(encode(JSON.stringify(fullPayload)));
  const signature = 'fake-signature';

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

const createFakeRefreshToken = (): string => `refresh-token-${Math.random()}`;

//Async Thunks: Register, login, refresh access token 
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (credentials: Credentials, { getState, rejectWithValue }) => {
    try {
      const { users } = (getState() as RootState).auth;
      await new Promise(resolve => setTimeout(() => resolve(undefined), 1000));
      if (users && users.find(u => u.username.toLowerCase() === credentials.username.toLowerCase())) {
        return rejectWithValue('Username already exists.');
      }
      const newUser: UserWithPassword = { username: credentials.username, password: credentials.password };
      return newUser;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed unexpectedly.');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: Credentials, { getState, rejectWithValue }) => {
    try {
      const { users } = (getState() as RootState).auth;
      console.log('THUNK: loginUser is firing... Current users in state:', users);

      if (!Array.isArray(users)) {
        throw new Error("User database is not loaded correctly.");
      }

      await new Promise(resolve => setTimeout(() => resolve(undefined), 1500));

      const foundUser = users.find(u => u.username.toLowerCase() === credentials.username.toLowerCase());

      if (foundUser && foundUser.password === credentials.password) {
        console.log('THUNK: Login successful. Creating tokens...');
        const { password: _, ...userPayload } = foundUser;
        const tokens: AuthTokens = {
          accessToken: createFakeJWT(userPayload),
          refreshToken: createFakeRefreshToken(),
        };
        return tokens;
      } else {
        console.log('THUNK: Login failed. Rejecting with value...');
        return rejectWithValue('Invalid username or password.');
      }
    } catch (error: any) {
      console.error('CRITICAL ERROR in loginUser thunk:', error);
      return rejectWithValue(error.message || 'Login failed unexpectedly.');
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { getState, rejectWithValue }) => {
    const { refreshToken, accessToken } = (getState() as RootState).auth;
    console.log("THUNK: Attempting to refresh token...");
    if (!refreshToken) return rejectWithValue('No refresh token available.');
    await new Promise(resolve => setTimeout(() => resolve(undefined), 1000));
    if (accessToken) {
      try {
        const decoded: User = jwtDecode(accessToken);
        const newAccessToken = createFakeJWT({ username: decoded.username });
        console.log("THUNK: Token refresh successful.");
        return { accessToken: newAccessToken };
      } catch (e) {
        console.error("Error decoding token during refresh:", e);
        return rejectWithValue('Invalid token state during refresh.');
      }
    }
    return rejectWithValue('Could not refresh token.');
  }
);

//Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },

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
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthTokens>) => {
        console.log('REDUCER: loginUser.fulfilled is RUNNING. Saving tokens.');
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log('REDUCER: loginUser.rejected. Error:', action.payload);
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Token Refresh cases
      .addCase(refreshAccessToken.pending, (state) => {
       console.log('REDUCER: refreshAccessToken.pending - Starting refresh on backend.');
        state.isRefreshing = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action: PayloadAction<{ accessToken: string }>) => {
        console.log('REDUCER: refreshAccessToken.fulfilled is completed');
        state.accessToken = action.payload.accessToken;
        state.isRefreshing = false;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        console.log('REDUCER: refreshAccessToken.rejected. Logging out.');
        state.accessToken = null;
        state.refreshToken = null;
        state.isRefreshing = false;
      });
  },
});

//selectors and Exports
export const selectCurrentUser = (state: RootState): { user: User; exp: number } | null => {
  if (state.auth.accessToken) {
    try {
      const decoded = jwtDecode<DecodedToken>(state.auth.accessToken);
      //user info and the expiration timestamp in debugger
      return { user: { username: decoded.username }, exp: decoded.exp };
    } catch (e) {
      console.log('Error decoding token in selector:', e);
      return null;
    }
  }
  return null;
};

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;