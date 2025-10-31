import type { NativeStackScreenProps } from '@react-navigation/native-stack';
//import type { MaterialTopTabScreenProp } from '@react-navigation/material-top-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';


export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};


export type ChatsStackParamList = {
  ChatList: undefined; 
  ChatScreen: { chatId: string; name: string; mediaUri: string };
  MediaView: { mediaUri: string };
};

export type MainTabParamList = {
  Chats: NavigatorScreenParams<ChatsStackParamList>; //nesting_copy
  Status: undefined;
  Calls: undefined;
  Profile: undefined;
};

//Props
export type ChatListScreenProps = NativeStackScreenProps<ChatsStackParamList, 'ChatList'>;
export type ChatScreenProps = NativeStackScreenProps<ChatsStackParamList, 'ChatScreen'>;
export type MediaViewScreenProps = NativeStackScreenProps<ChatsStackParamList, 'MediaView'>;

export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

//Props for the screens in the Main Tab (useful if you need the tab navigator's props)
export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<AuthStackParamList, T>;

