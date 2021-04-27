import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import LoginScreen from "../screens/LoginScreen";

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Drawer = createDrawerNavigator();

function RootNavigator() {
  return (
      <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />} initialRouteName="LoginScreen">
          <Drawer.Screen name="LoginScreen" component={LoginScreen} />
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
