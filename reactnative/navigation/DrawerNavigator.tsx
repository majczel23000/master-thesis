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
    UserDetailsParamList,
    UserAddParamList,
    RoleDetailsParamList,
    ImageDetailsParamList,
    ImageAddParamList,
    SettingDetailsParamList,
    SettingAddParamList,
    DictionaryDetailsParamList,
    DictionaryAddParamList
} from '../types';
import { StyleSheet } from 'react-native';
import DashboardScreen from "../screens/DashboardScreen";
import CarouselScreen from "../screens/CarouselScreen";
import isLoggedIn from "../hooks/isLoggedIn";
import DictionaryScreen from "../screens/DictionaryScreen";
import DictionaryDetailsScreen from "../screens/DictionaryDetailsScreen";
import DictionaryAddScreen from "../screens/DictionaryAddScreen";
import ImageScreen from "../screens/ImageScreen";
import RoleScreen from "../screens/RoleScreen";
import SettingScreen from "../screens/SettingScreen";
import UserScreen from "../screens/UserScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LoggedInHeader from '../components/LoggedInHeader';
import { IconButton } from "react-native-paper";
import UserDetailsScreen from "../screens/UserDetailsScreen";
import UserAddScreen from "../screens/UserAdd";
import RoleDetailsScreen from "../screens/RoleDetailsScreen";
import ImageDetailsScreen from "../screens/ImageDetailsScreen";
import ImageAddScreen from "../screens/ImageAddScreen";
import SettingDetailsScreen from "../screens/SettingDetailsScreen";
import SettingAddScreen from "../screens/SettingAddScreen";

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
                    name="User"
                    component={UserNavigator}
                />
                <Drawer.Screen
                    name="UserDetails"
                    component={UserDetailsNavigator}
                />
                <Drawer.Screen
                    name="UserAdd"
                    component={UserAddNavigator}
                />
                <Drawer.Screen
                    name="Role"
                    component={RoleNavigator}
                />
                <Drawer.Screen
                    name="RoleDetails"
                    component={RoleDetailsNavigator}
                />
                <Drawer.Screen
                    name="Image"
                    component={ImageNavigator}
                />
                <Drawer.Screen
                    name="ImageDetails"
                    component={ImageDetailsNavigator}
                />
                <Drawer.Screen
                    name="ImageAdd"
                    component={ImageAddNavigator}
                />
                <Drawer.Screen
                    name="Setting"
                    component={SettingNavigator}
                />
                <Drawer.Screen
                    name="SettingDetails"
                    component={SettingDetailsNavigator}
                />
                <Drawer.Screen
                    name="SettingAdd"
                    component={SettingAddNavigator}
                />
                <Drawer.Screen
                    name="Dictionary"
                    component={DictionaryNavigator}
                />
                <Drawer.Screen
                    name="DictionaryDetails"
                    component={DictionaryDetailsNavigator}
                />
                <Drawer.Screen
                    name="DictionaryAdd"
                    component={DictionaryAddNavigator}
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

const UserAddStack = createStackNavigator<UserAddParamList>();
function UserAddNavigator() {
    return (
        <UserAddStack.Navigator>
            <UserAddStack.Screen
                options={{
                    title: 'CMS',
                    headerTitleStyle: styles.headerTitleStyle,
                    headerStyle: styles.headerStyle,
                    headerTitle: props => <LoggedInHeader {...props} />
                }}
                name="UserAddScreen"
                component={UserAddScreen}
            />
        </UserAddStack.Navigator>
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

const RoleDetailsStack = createStackNavigator<RoleDetailsParamList>();
function RoleDetailsNavigator({ route }: { route: any}) {
    return (
        <RoleDetailsStack.Navigator>
            <RoleDetailsStack.Screen
                options={{
                    title: 'CMS',
                    headerTitleStyle: styles.headerTitleStyle,
                    headerStyle: styles.headerStyle,
                    headerTitle: props => <LoggedInHeader {...props} />
                }}
                name="RoleDetailsScreen"
            >
                {() => <RoleDetailsScreen {...route.params} />}
            </RoleDetailsStack.Screen>
        </RoleDetailsStack.Navigator>
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

const ImageDetailsStack = createStackNavigator<ImageDetailsParamList>();
function ImageDetailsNavigator({ route }: { route: any}) {
    return (
        <ImageDetailsStack.Navigator>
            <ImageDetailsStack.Screen
                options={{
                    title: 'CMS',
                    headerTitleStyle: styles.headerTitleStyle,
                    headerStyle: styles.headerStyle,
                    headerTitle: props => <LoggedInHeader {...props} />
                }}
                name="ImageDetailsScreen"
            >
                {() => <ImageDetailsScreen {...route.params} />}
            </ImageDetailsStack.Screen>
        </ImageDetailsStack.Navigator>
    )
}

const ImageAddStack = createStackNavigator<ImageAddParamList>();
function ImageAddNavigator() {
    return (
        <ImageAddStack.Navigator>
            <ImageAddStack.Screen
                options={{
                    title: 'CMS',
                    headerTitleStyle: styles.headerTitleStyle,
                    headerStyle: styles.headerStyle,
                    headerTitle: props => <LoggedInHeader {...props} />
                }}
                name="ImageAddScreen"
                component={ImageAddScreen}
            />
        </ImageAddStack.Navigator>
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

const SettingDetailsStack = createStackNavigator<SettingDetailsParamList>();
function SettingDetailsNavigator({ route }: { route: any}) {
    return (
        <SettingDetailsStack.Navigator>
            <SettingDetailsStack.Screen
                options={{
                    title: 'CMS',
                    headerTitleStyle: styles.headerTitleStyle,
                    headerStyle: styles.headerStyle,
                    headerTitle: props => <LoggedInHeader {...props} />
                }}
                name="SettingDetailsScreen"
            >
                {() => <SettingDetailsScreen {...route.params} />}
            </SettingDetailsStack.Screen>
        </SettingDetailsStack.Navigator>
    )
}

const SettingAddStack = createStackNavigator<SettingAddParamList>();
function SettingAddNavigator() {
    return (
        <SettingAddStack.Navigator>
            <SettingAddStack.Screen
                options={{
                    title: 'CMS',
                    headerTitleStyle: styles.headerTitleStyle,
                    headerStyle: styles.headerStyle,
                    headerTitle: props => <LoggedInHeader {...props} />
                }}
                name="SettingAddScreen"
                component={SettingAddScreen}
            />
        </SettingAddStack.Navigator>
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


const DictionaryDetailsStack = createStackNavigator<DictionaryDetailsParamList>();
function DictionaryDetailsNavigator({ route }: { route: any}) {
    return (
        <DictionaryDetailsStack.Navigator>
            <DictionaryDetailsStack.Screen
                options={{
                    title: 'CMS',
                    headerTitleStyle: styles.headerTitleStyle,
                    headerStyle: styles.headerStyle,
                    headerTitle: props => <LoggedInHeader {...props} />
                }}
                name="DictionaryDetailsScreen"
            >
                {() => <DictionaryDetailsScreen {...route.params} />}
            </DictionaryDetailsStack.Screen>
        </DictionaryDetailsStack.Navigator>
    )
}

const DictionaryAddStack = createStackNavigator<DictionaryAddParamList>();
function DictionaryAddNavigator() {
    return (
        <DictionaryAddStack.Navigator>
            <DictionaryAddStack.Screen
                options={{
                    title: 'CMS',
                    headerTitleStyle: styles.headerTitleStyle,
                    headerStyle: styles.headerStyle,
                    headerTitle: props => <LoggedInHeader {...props} />
                }}
                name="DictionaryAddScreen"
                component={DictionaryAddScreen}
            />
        </DictionaryAddStack.Navigator>
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
