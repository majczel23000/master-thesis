import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as React from 'react';
import LoginScreen from "../screens/LoginScreen";
import {DashboardParamList,DictionaryParamList,ImageParamList,RoleParamList,
    DrawerParamList,SettingParamList,UserParamList,LoginParamList,CarouselParamList, ProfileParamList} from '../types';
import { StyleSheet } from 'react-native';
import DashboardScreen from "../screens/DashboardScreen";
import CarouselScreen from "../screens/CarouselScreen";
import isLoggedIn from "../hooks/isLoggedIn";
import DictionaryScreen from "../screens/DictionaryScreen";
import ImageScreen from "../screens/ImageScreen";
import RoleScreen from "../screens/RoleScreen";
import SettingScreen from "../screens/SettingScreen";
import UserScreen from "../screens/UserScreen";
import ProfileScreen from "../screens/ProfileScreen";
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
                <Drawer.Screen
                    name="Carousel"
                    component={CarouselNavigator}
                />
                <Drawer.Screen
                    name="Dictionary"
                    component={DictionaryNavigator}
                />
                <Drawer.Screen
                    name="Image"
                    component={ImageNavigator}
                />
                <Drawer.Screen
                    name="Role"
                    component={RoleNavigator}
                />
                <Drawer.Screen
                    name="Setting"
                    component={SettingNavigator}
                />
                <Drawer.Screen
                    name="User"
                    component={UserNavigator}
                />
                <Drawer.Screen
                    name="Profile"
                    component={ProfileNavigator}
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

const CarouselStack = createStackNavigator<CarouselParamList>();

function CarouselNavigator() {
    return (
        <CarouselStack.Navigator>
            <CarouselStack.Screen
                options={{
                    title: 'CMS',
                    headerTitleStyle: styles.headerTitleStyle,
                    headerStyle: styles.headerStyle,
                }}
                name="CarouselScreen"
                component={CarouselScreen}
            />
        </CarouselStack.Navigator>
    )
}

const DictionaryStack = createStackNavigator<DictionaryParamList>();

function DictionaryNavigator() {
    return (
        <DictionaryStack.Navigator>
            <DictionaryStack.Screen
                options={{
                    title: 'CMS',
                    headerTitleStyle: styles.headerTitleStyle,
                    headerStyle: styles.headerStyle,
                }}
                name="DictionaryScreen"
                component={DictionaryScreen}
            />
        </DictionaryStack.Navigator>
    )
}

const ImageStack = createStackNavigator<ImageParamList>();

function ImageNavigator() {
    return (
        <ImageStack.Navigator>
            <ImageStack.Screen
                options={{
                    title: 'CMS',
                    headerTitleStyle: styles.headerTitleStyle,
                    headerStyle: styles.headerStyle,
                }}
                name="ImageScreen"
                component={ImageScreen}
            />
        </ImageStack.Navigator>
    )
}

const RoleStack = createStackNavigator<RoleParamList>();

function RoleNavigator() {
    return (
        <RoleStack.Navigator>
            <RoleStack.Screen
                options={{
                    title: 'CMS',
                    headerTitleStyle: styles.headerTitleStyle,
                    headerStyle: styles.headerStyle,
                }}
                name="RoleScreen"
                component={RoleScreen}
            />
        </RoleStack.Navigator>
    )
}

const SettingStack = createStackNavigator<SettingParamList>();

function SettingNavigator() {
    return (
        <SettingStack.Navigator>
            <SettingStack.Screen
                options={{
                    title: 'CMS',
                    headerTitleStyle: styles.headerTitleStyle,
                    headerStyle: styles.headerStyle,
                }}
                name="SettingScreen"
                component={SettingScreen}
            />
        </SettingStack.Navigator>
    )
}

const UserStack = createStackNavigator<UserParamList>();

function UserNavigator() {
    return (
        <UserStack.Navigator>
            <UserStack.Screen
                options={{
                    title: 'CMS',
                    headerTitleStyle: styles.headerTitleStyle,
                    headerStyle: styles.headerStyle,
                }}
                name="UserScreen"
                component={UserScreen}
            />
        </UserStack.Navigator>
    )
}

const ProfileStack = createStackNavigator<ProfileParamList>();

function ProfileNavigator() {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen
                options={{
                    title: 'CMS',
                    headerTitleStyle: styles.headerTitleStyle,
                    headerStyle: styles.headerStyle,
                }}
                name="ProfileScreen"
                component={ProfileScreen}
            />
        </ProfileStack.Navigator>
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
