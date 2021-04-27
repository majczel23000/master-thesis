import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import isLoggedIn from "../hooks/isLoggedIn";

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
const Drawer = createDrawerNavigator();

function RootNavigator() {
    const loggedIn = isLoggedIn();
  return (
      <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />} initialRouteName={loggedIn ? 'LoginScreen' : 'DashboardScreen'}>
          <Drawer.Screen name="LoginScreen" component={LoginScreen} />
          <Drawer.Screen name="DashboardScreen" component={DashboardScreen} />
      </Drawer.Navigator>
  );
}

function CustomDrawerContent(props: any) {
    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
}
