import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as React from 'react';
import LoginScreen from "../screens/LoginScreen";
import {DashboardParamList, DrawerParamList, LoginParamList} from '../types';
import { StyleSheet } from 'react-native';
import DashboardScreen from "../screens/DashboardScreen";
import isLoggedIn from "../hooks/isLoggedIn";
const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {

    const loggedIn = isLoggedIn();
    console.log(loggedIn);
    if (loggedIn === 'null') {
        return null;
    } else {
        return (
            <Drawer.Navigator initialRouteName={loggedIn === 'true' ? 'Dashboard' : 'Login'}>
                <Drawer.Screen
                    name="Login"
                    component={LoginNavigator}
                />
                <Drawer.Screen
                    name="Dashboard"
                    component={DashboardNavigator}
                />
            </Drawer.Navigator>
        );
    }
}

const LoginStack = createStackNavigator<LoginParamList>();

function LoginNavigator() {
    return (
        <LoginStack.Navigator>
            <LoginStack.Screen
                options={{
                    title: 'CMS',
                    headerTitleStyle: styles.headerTitleStyle,
                    headerStyle: styles.headerStyle,
                }}
                name="LoginScreen"
                component={LoginScreen}
            />
        </LoginStack.Navigator>
    )
}

const DashboardStack = createStackNavigator<DashboardParamList>();

function DashboardNavigator() {
    return (
        <DashboardStack.Navigator>
            <DashboardStack.Screen
                options={{
                    title: 'CMS',
                    headerTitleStyle: styles.headerTitleStyle,
                    headerStyle: styles.headerStyle,
                }}
                name="DashboardScreen"
                component={DashboardScreen}
            />
        </DashboardStack.Navigator>
    )
}

const styles = StyleSheet.create({
    headerTitleStyle: {
        alignSelf: "center",
        fontWeight: "bold",
        color: "#f6f6f6",
    },
    headerStyle: {
        backgroundColor: "orange"
    }
});
