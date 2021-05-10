import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {useEffect} from "react";
import {StackHeaderLeftButtonProps} from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useNavigation } from '@react-navigation/native';
import {Button, Modal, Portal, Provider, TextInput} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProfileModel } from "../models/Profile.model";
import detailsStyles from "../styles/detailsStyles";
import moduleStyles from "../styles/moduleStyles";
import Location from "../components/Location";
import ModuleNavigation from "../components/ModuleNavigation";

export default function ProfileScreen( route: { profile: ProfileModel } ) {

    const profile = route.profile;

    useEffect(() => {
        navigation.setOptions({
            headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
        });
    });

    const navigation = useNavigation();
    const [FirstName, onChangeFirstName] = React.useState(route.profile.FirstName || 'FirstName');
    const [LastName, onChangeLastName] = React.useState(route.profile.LastName || 'LastName');
    const [password, onChangePassword] = React.useState(route.profile.password || 'password');

    // Modal logic
    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const save = () => {

    }

    const clear = () => {

    }

    const changeStatus = () => {

    }

    return (
        <Provider>
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={hideModal}
                    contentContainerStyle={detailsStyles.modal}>
                    <Text style={detailsStyles.modalTitle}>Change Status</Text>
                    <Text style={detailsStyles.modalInfo}>Are you sure you want to change status of this profile?</Text>
                    <Button
                        mode="contained"
                        style={detailsStyles.btnYes}
                        onPress={changeStatus}>
                        Yes
                    </Button>
                    <Button
                        mode="contained"
                        style={detailsStyles.btnNo}
                        onPress={hideModal}>
                        No
                    </Button>
                </Modal>
            </Portal>
            <View style={moduleStyles.container}>
                <Location location={`profiles > ${profile.FirstName} ${profile.LastName}`}/>
                <ModuleNavigation elements={[
                    {text: 'Profiles list', url: 'Profile'}
                ]} />
                <View style={moduleStyles.box}>
                    <Text style={moduleStyles.header}>Role: {profile.FirstName} {profile.LastName}</Text>

                    <Text style={detailsStyles.label}>First Name:</Text>
                    <TextInput
                        style={detailsStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A', text: 'black'}}}
                        value={FirstName}
                        onChangeText={onChangeFirstName}
                    />
                    <Text style={detailsStyles.label}>Last Name:</Text>
                    <TextInput
                        style={detailsStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A', text: 'black'}}}
                        value={LastName}
                        onChangeText={onChangeLastName}
                    />
                    <Text style={detailsStyles.label}>Created At:</Text>
                    <TextInput
                        style={detailsStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A', text: 'black'}}}
                        value={profile.createdAt || 'data utworzenia'}
                    />
                    <Text style={detailsStyles.label}>Status:</Text>
                    <Button color={profile.status === 'ACTIVE' ? 'green' : 'red'}
                            labelStyle={detailsStyles.status}
                            onPress={showModal}>{profile.status || 'UNKNOW'}</Button>
                    <Button
                        mode="contained"
                        style={moduleStyles.btn}
                        onPress={save}>
                        Save changes
                    </Button>
                    <Button
                        mode="contained"
                        style={moduleStyles.btnClear}
                        onPress={clear}>
                        Clear changes
                    </Button>
                </View>
            </View>
        </Provider>
    );
}
