import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import * as React from 'react';
import LoginScreen from "../screens/LoginScreen";
import {
    DashboardParamList,
    DictionaryParamList,
    ImageParamList,
    RoleParamList,
    DrawerParamList,
    SettingParamList,
    UserParamList,
    LoginParamList,
    CarouselParamList,
    ProfileParamList,
    UserDetailsParamList
} from '../types';
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
import LoggedInHeader from '../components/LoggedInHeader';
import { IconButton } from "react-native-paper";
import UserDetailsScreen from "../screens/UserDetailsScreen";

const Drawer = createDrawerNavigator<DrawerParamList>();

function CustomDrawerContent(props: any) {

    return (
        <DrawerContentScrollView {...props} style={styles.drawerStyle}>
            <DrawerItem
                label="Dashboard"
                style={styles.drawerItemBox}
                labelStyle={styles.drawerItemLabel}
                onPress={() => props.navigation.navigate('Dashboard')}
                icon={() => <IconButton icon="view-dashboard" color='black'> </IconButton>}
            />
            <DrawerItem
                label="Users"
                style={styles.drawerItemBox}
                labelStyle={styles.drawerItemLabel}
                onPress={() => props.navigation.navigate('User')}
                icon={() => <IconButton icon="account-circle" color='black'> </IconButton>}
            />
            <DrawerItem
                label="Roles"
                style={styles.drawerItemBox}
                labelStyle={styles.drawerItemLabel}
                onPress={() => props.navigation.navigate('Role')}
                icon={() => <IconButton icon="human" color='black'> </IconButton>}
            />
            {/*<DrawerItem*/}
            {/*    label="Faqs"*/}
            {/*    style={styles.drawerItemBox}*/}
            {/*    labelStyle={styles.drawerItemLabel}*/}
            {/*    onPress={() => props.navigation.navigate('Faq')}*/}
            {/*    icon={() => <IconButton icon="question_answer" color='black'> </IconButton>}*/}
            {/*/>*/}
            {/*<DrawerItem*/}
            {/*    label="Menus"*/}
            {/*    style={styles.drawerItemBox}*/}
            {/*    labelStyle={styles.drawerItemLabel}*/}
            {/*    onPress={() => props.navigation.navigate('Menu')}*/}
            {/*    icon={() => <IconButton icon="menu" color='black'> </IconButton>}*/}
            {/*/>*/}
            <DrawerItem
                label="Images"
                style={styles.drawerItemBox}
                labelStyle={styles.drawerItemLabel}
                onPress={() => props.navigation.navigate('Image')}
                icon={() => <IconButton icon="image" color='black'> </IconButton>}
            />
            <DrawerItem
                label="Settings"
                style={styles.drawerItemBox}
                labelStyle={styles.drawerItemLabel}
                onPress={() => props.navigation.navigate('Setting')}
                icon={() => <IconButton icon="settings" color='black'> </IconButton>}
            />
            <DrawerItem
                label="Dictionaries"
                style={styles.drawerItemBox}
                labelStyle={styles.drawerItemLabel}
                onPress={() => props.navigation.navigate('Dictionary')}
                icon={() => <IconButton icon="book" color='black'> </IconButton>}
            />
            <DrawerItem
                label="Profile"
                style={styles.drawerItemBox}
                labelStyle={styles.drawerItemLabel}
                onPress={() => props.navigation.navigate('Profile')}
                icon={() => <IconButton icon="account" color='black'> </IconButton>}
            />
        </DrawerContentScrollView>
    );
}

export default function DrawerNavigator() {

    const loggedIn = isLoggedIn();
    if (loggedIn === 'null') {
        return null;
    } else {
        return (
            <Drawer.Navigator
                initialRouteName={loggedIn === 'true' ? 'Dashboard' : 'Login'}
                drawerContent={props => CustomDrawerContent(props)}>
                <Drawer.Screen
                    name="Login"
                    component={LoginNavigator}
                />
                <Drawer.Screen
                    name="Dashboard"
                    component={DashboardNavigator}
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
                    name="UserDetails"
                    component={UserDetailsNavigator}
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
                    title: 'CMSs',
                    headerTitleStyle: styles.headerTitleStyle,
                    headerStyle: styles.headerStyle,
                    headerTitle: props => <LoggedInHeader {...props} />
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
                    headerTitle: props => <LoggedInHeader {...props} />
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
                    headerTitle: props => <LoggedInHeader {...props} />
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
                    headerTitle: props => <LoggedInHeader {...props} />
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
                    headerTitle: props => <LoggedInHeader {...props} />
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
                    headerTitle: props => <LoggedInHeader {...props} />
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
                    headerTitle: props => <LoggedInHeader {...props} />
                }}
                name="UserScreen"
                component={UserScreen}
            />
        </UserStack.Navigator>
    )
}

const UserDetailsStack = createStackNavigator<UserDetailsParamList>();

function UserDetailsNavigator({ route }: { route: any}) {
    return (
        <UserDetailsStack.Navigator>
            <UserDetailsStack.Screen
                options={{
                    title: 'CMS',
                    headerTitleStyle: styles.headerTitleStyle,
                    headerStyle: styles.headerStyle,
                    headerTitle: props => <LoggedInHeader {...props} />
                }}
                name="UserDetailsScreen"
            >
                {() => <UserDetailsScreen {...route.params} />}
            </UserDetailsStack.Screen>
        </UserDetailsStack.Navigator>
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
                    headerTitle: props => <LoggedInHeader {...props} />
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
        fontSize: 25
    },
    headerStyle: {
        backgroundColor: "orange"
    },
    drawerStyle: {
        backgroundColor: "#ffd38c"
    },
    drawerItemLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212529'
    },
    drawerItemBox: {
        height: '7vh'
    }
});
