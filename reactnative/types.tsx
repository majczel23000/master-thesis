import { GestureResponderEvent } from "react-native";

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
};

export type TabOneParamList = {
  TabOneScreen: undefined;
};

export type DrawerParamList = {
  Login: undefined;
  Dashboard: undefined;
  Carousel: undefined;
  Dictionary: undefined;
  Image: undefined;
  Role: undefined;
  Setting: undefined;
  User: undefined;
  Profile: undefined;
};

export type LoginParamList = {
  LoginScreen: undefined;
};

export type DashboardParamList = {
  DashboardScreen: undefined;
};

export type DictionaryParamList = {
  DictionaryScreen: undefined;
};

export type ImageParamList = {
  ImageScreen: undefined;
};

export type RoleParamList = {
  RoleScreen: undefined;
};

export type SettingParamList = {
  SettingScreen: undefined;
};

export type UserParamList = {
  UserScreen: undefined;
};

export type CarouselParamList = {
  CarouselScreen: undefined;
};

export type ProfileParamList = {
  ProfileScreen: undefined;
};

export type onPressFunc = (event: GestureResponderEvent) => void;
