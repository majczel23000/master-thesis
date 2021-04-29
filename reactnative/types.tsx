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
};

export type LoginParamList = {
  LoginScreen: undefined;
};

export type DashboardParamList = {
  DashboardScreen: undefined;
};

export type onPressFunc = (event: GestureResponderEvent) => void;
