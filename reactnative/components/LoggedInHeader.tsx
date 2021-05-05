import {Image, StyleSheet, Text} from "react-native";
import {IconButton, Menu, Provider} from 'react-native-paper'
import * as React from "react";
import {View} from "./Themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation} from "@react-navigation/native";

export default function LoggedInHeader(props: any) {

    const [visible, setVisible] = React.useState(false);

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);

    const navigation = useNavigation();

    const logout = () => {
        AsyncStorage.setItem('LOGGED_IN', 'false');
        navigation.navigate('Login');
        closeMenu();
    }

    const goToProfile = () => {
        navigation.navigate('Profile');
        closeMenu();
    }

    return (
        <Provider>
            <View style={styles.view}>
                <Text style={styles.text}>CMS</Text>
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    style={styles.menu}
                    anchor={<IconButton
                        icon="account"
                        style={styles.img}
                        color='white'
                        onPress={openMenu}> </IconButton>}>
                    <Menu.Item onPress={goToProfile} title="Profile" />
                    <Menu.Item onPress={logout} title="Logout" />
                </Menu>
            </View>
        </Provider>
    );
}

const styles = StyleSheet.create({
    menu: {
      marginLeft: '-27vw',
    },
    view: {
      backgroundColor: 'orange',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        fontWeight: "bold",
        color: "#f6f6f6",
        marginLeft: '25vw',
        fontSize: 25
    },
    img: {
        backgroundColor: "orange",
        color: 'red',
    }
});
