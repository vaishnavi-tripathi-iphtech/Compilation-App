import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';
import { jwtDecode } from 'jwt-decode';
import { encode } from 'base-64';

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  userName: string;
  email:string;
  phone:string;
  address:string;
  gender: 'male'|'female'|'other'|'prefer not to say';
}

interface UserRecord extends User {
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
  users: UserRecord[]; //mock user db
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}
interface JwtPayload {
  id: string;
  username: string;
  iat: number; //Issued At
  exp: number; //Expiration Time
}

//Initial State
const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  users: [ ],
  isLoading: false,
  isRefreshing: false,
  error: null,
};

//Mock JWT Functions
const createFakeJWT = (payload: { id: string; username: string }): string => {
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
  async (userData: Omit<UserRecord, 'id'>, { getState, rejectWithValue }) => {
    try {
      const { users } = (getState() as RootState).auth;
      //check for existing username/email
      const newUser: UserRecord = {
        id: `user-${Math.random()}`, // Create a unique ID
        ...userData,
      };
      return newUser;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: Credentials, { getState, rejectWithValue }) => {
        try {
            // find user in `users` array from state
            const { users } = (getState() as RootState).auth;
            const foundUser = users.find(
                (u) => u.username === credentials.username || u.email === credentials.username
            );

            if (foundUser && foundUser.password === credentials.password) {
                // --- Create JWT with MINIMAL payload ---
                const tokens: AuthTokens = {
                    accessToken: createFakeJWT({ id: foundUser.id, username: foundUser.username }),
                    refreshToken: createFakeRefreshToken(),
                };
                return tokens;
            } else {
                return rejectWithValue('Invalid username or password.');
            }
        } catch (error: any) {
            return rejectWithValue(error.message);
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
        const newAccessToken = createFakeJWT({ id: decoded.id, username: decoded.username });
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
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
        const { id } = action.payload;
        if (!id) return;
        
        const userIndex = state.users.findIndex(user => user.id === id);
        if (userIndex !== -1) {
            state.users[userIndex] = { ...state.users[userIndex], ...action.payload };
        }
    },
  },

  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<UserRecord>) => {
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
export const selectCurrentUser = (state: RootState):  User | null => {
  if (state.auth.accessToken) {
    try {
      const decoded = jwtDecode<JwtPayload>(state.auth.accessToken);
      //user info and the expiration timestamp in debugger
      return state.auth.users.find(user => user.id === decoded.id) || null;
    } catch (e) {
      console.log('Error decoding token in selector:', e);
      return null;
    }
  }
  return null;
};

export const { logout, clearError , updateUserProfile} = authSlice.actions;
export default authSlice.reducer;