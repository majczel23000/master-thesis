import * as React from 'react';
import { Text, View } from 'react-native';
import { useEffect } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useNavigation } from '@react-navigation/native';
import moduleStyles from "../styles/moduleStyles";
import Location from "../components/Location";
import ModuleNavigation from "../components/ModuleNavigation";
import { Modal, Portal, Button, Provider, TextInput } from "react-native-paper";
import detailsStyles from "../styles/detailsStyles";
import { RoleModel } from "../models/roles/Role.model";

export default function RoleDetailsScreen( route: { role: RoleModel } ) {

    const role = route.role;

    useEffect(() => {
        navigation.setOptions({
            headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
        });
    });

    const navigation = useNavigation();
    const [name, onChangeName] = React.useState(route.role.name || 'Name');
    const [description, onChangeDescription] = React.useState(route.role.description || 'Description');

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
                    <Text style={detailsStyles.modalInfo}>Are you sure you want to change status of this role?</Text>
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
                <Location location={`roles > ${role.code}`}/>
                <ModuleNavigation elements={[
                    {text: 'Roles list', url: 'Role'}
                ]} />
                <View style={moduleStyles.box}>
                    <Text style={moduleStyles.header}>Role: {role.code}</Text>
                    <Text style={detailsStyles.label}>Code: </Text>
                    <TextInput
                        style={detailsStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A', text: 'black'}}}
                        value={role.code}
                    />
                    <Text style={detailsStyles.label}>Name:</Text>
                    <TextInput
                        style={detailsStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A', text: 'black'}}}
                        value={name}
                        onChangeText={onChangeName}
                    />
                    <Text style={detailsStyles.label}>Description:</Text>
                    <TextInput
                        style={detailsStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A', text: 'black'}}}
                        value={description}
                        onChangeText={onChangeDescription}
                    />
                    <Text style={detailsStyles.label}>Created At:</Text>
                    <TextInput
                        style={detailsStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A', text: 'black'}}}
                        value={role.createdAt || 'data utworzenia'}
                    />
                    <Text style={detailsStyles.label}>Status:</Text>
                    <Button color={role.status === 'ACTIVE' ? 'green' : 'red'}
                            labelStyle={detailsStyles.status}
                            onPress={showModal}>{role.status || 'UNKNOW'}</Button>
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
