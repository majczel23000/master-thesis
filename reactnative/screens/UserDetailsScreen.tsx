import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import { useEffect } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useNavigation } from '@react-navigation/native';
import moduleStyles from "../styles/moduleStyles";
import Location from "../components/Location";
import ModuleNavigation from "../components/ModuleNavigation";
import { UserModel } from "../models/users/User.model";
import { Modal, Portal, Button, Provider, Checkbox, TextInput } from "react-native-paper";
import detailsStyles from "../styles/detailsStyles";

export default function UserDetailsScreen( route: { user: UserModel } ) {

    const user = route.user;

    useEffect(() => {
        navigation.setOptions({
            headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
        });
    });

    const roles = [
        {id: 0, checked: false, title: 'USER_ADD'},
        {id: 1, checked: false, title: 'USER_DELETE'},
        {id: 2, checked: false, title: 'USER_ADD'},
        {id: 3, checked: false, title: 'USER_DELETE'},
        {id: 4, checked: false, title: 'USER_ADD'},
        {id: 5, checked: false, title: 'USER_DELETE'},
        {id: 6, checked: false, title: 'USER_ADD'},
        {id: 7, checked: false, title: 'USER_DELETE'},
    ]

    const navigation = useNavigation();
    const [firstName, onChangeFirstName] = React.useState(route.user.firstName || 'Imie');
    const [lastName, onChangeLastName] = React.useState(route.user.lastName || 'Nazwisko');
    const [email, onChangeEmail] = React.useState(route.user.email || 'Email');
    const [checkboxes, setCheckboxes] = React.useState(roles)

    // Modal logic
    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const handleCheck = (checkedId: number) => {
        let temp = checkboxes.map((checkbox) => {
            if (checkedId === checkbox.id) {
                return { ...checkbox, checked: !checkbox.checked };
            }
            return checkbox;
        });
        setCheckboxes(temp);
    }

    const save = () => {

    }

    const clear = () => {

    }

    const remove = () => {

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
                    <Text style={detailsStyles.modalInfo}>Are you sure you want to change status of this user?</Text>
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
                <Location location={`users > ${user.email}`}/>
                <ModuleNavigation elements={[
                    {text: 'Users list', url: 'User'},
                    {text: 'Add new user', url: 'UserAdd'}
                ]} />
                <View style={moduleStyles.box}>
                    <Text style={moduleStyles.header}>User: {user.email}</Text>
                    <Text style={detailsStyles.label}>First Name:</Text>
                    <TextInput
                        style={detailsStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A', text: 'black'}}}
                        value={firstName}
                        onChangeText={onChangeFirstName}
                    />
                    <Text style={detailsStyles.label}>Last Name:</Text>
                    <TextInput
                        style={detailsStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A', text: 'black'}}}
                        value={lastName}
                        onChangeText={onChangeLastName}
                    />
                    <Text style={detailsStyles.label}>Email:</Text>
                    <TextInput
                        style={detailsStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A', text: 'black'}}}
                        value={email}
                        onChangeText={onChangeEmail}
                    />
                    <Text style={detailsStyles.label}>Created At:</Text>
                    <TextInput
                        style={detailsStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A', text: 'black'}}}
                        value={user.createdAt || 'data utworzenia'}
                    />
                    <Text style={detailsStyles.label}>Updated At:</Text>
                    <TextInput
                        style={detailsStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A', text: 'black'}}}
                        value={user.createdAt || 'data modyfikacji'}
                    />
                    <Text style={detailsStyles.label}>Status:</Text>
                    <Button color={user.status === 'ACTIVE' ? 'green' : 'red'}
                            labelStyle={detailsStyles.status}
                            onPress={showModal}>{user.status || 'UNKNOW'}</Button>
                    <Text style={detailsStyles.label}>Roles:</Text>
                    <View style={styles.checkboxView}>
                        {
                            checkboxes.map(checkbox =>
                                <View key={checkbox.id + 'v'} style={styles.checkbox}>
                                    <Checkbox
                                        key={checkbox.id}
                                        color={'orange'}
                                        uncheckedColor={'gray'}
                                        status={checkbox.checked ? 'checked' : 'unchecked'}
                                        onPress={() => handleCheck(checkbox.id)}
                                    />
                                    <Text>{checkbox.title}</Text>
                                </View>
                            )
                        }
                    </View>
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
                    <Button
                        mode="contained"
                        style={moduleStyles.btnRemove}
                        onPress={remove}>
                        Remove user
                    </Button>
                </View>
            </View>
        </Provider>
    );
}

const styles = StyleSheet.create({
    text: {
        marginTop: '2vh',
        marginBottom: '2vh',
        fontSize: 18,
    },
    checkboxView: {
        display: "flex",
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    checkbox: {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '50%',
    }
})
