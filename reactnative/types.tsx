import { GestureResponderEvent } from "react-native";

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type DrawerParamList = {
  Login: undefined;
  Dashboard: undefined;
  User: undefined;
  UserDetails: undefined;
  UserAdd: undefined;
  Role: undefined;
  RoleDetails: undefined;
  Image: undefined;
  ImageDetails: undefined;
  ImageAdd: undefined;
  Setting: undefined;
  SettingDetails: undefined;
  SettingAdd: undefined;
  Carousel: undefined;
  Dictionary: undefined;
  DictionaryDetails: undefined;
  DictionaryAdd: undefined;
  Menu: undefined;
  MenuDetails: undefined;
  MenuAdd: undefined;
  Profile: undefined;
  Faq: undefined;
  FaqDetails: undefined;
  FaqAdd: undefined;
};

export type LoginParamList = {
  LoginScreen: undefined;
};

export type DashboardParamList = {
  DashboardScreen: undefined;
};

export type UserParamList = {
  UserScreen: undefined;
};
export type UserDetailsParamList = {
  UserDetailsScreen: undefined;
};
export type UserAddParamList = {
  UserAddScreen: undefined;
};

export type RoleParamList = {
  RoleScreen: undefined;
};
export type RoleDetailsParamList = {
  RoleDetailsScreen: undefined;
};

export type ImageParamList = {
  ImageScreen: undefined;
};
export type ImageDetailsParamList = {
  ImageDetailsScreen: undefined;
};
export type ImageAddParamList = {
  ImageAddScreen: undefined;
};

export type SettingParamList = {
  SettingScreen: undefined;
};
export type SettingDetailsParamList = {
  SettingDetailsScreen: undefined;
};
export type SettingAddParamList = {
  SettingAddScreen: undefined;
};

export type DictionaryParamList = {
  DictionaryScreen: undefined;
};
export type DictionaryDetailsParamList = {
  DictionaryDetailsScreen: undefined;
};
export type DictionaryAddParamList = {
  DictionaryAddScreen: undefined;
};

export type MenuParamList = {
  MenuScreen: undefined;
};
export type MenuDetailsParamList = {
  MenuDetailsScreen: undefined;
};
export type MenuAddParamList = {
  MenuAddScreen: undefined;
};

export type FaqParamList = {
  FaqScreen: undefined;
};
export type FaqDetailsParamList = {
  FaqDetailsScreen: undefined;
};
export type FaqAddParamList = {
  FaqAddScreen: undefined;
};

export type CarouselParamList = {
  CarouselScreen: undefined;
};

export type ProfileParamList = {
  ProfileScreen: undefined;
};

export type onPressFunc = (event: GestureResponderEvent) => void;
