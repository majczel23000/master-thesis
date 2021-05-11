import * as React from 'react';
import { useState } from 'react';
import { Text, View, Picker } from 'react-native';
import { useEffect } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useNavigation } from '@react-navigation/native';
import moduleStyles from "../styles/moduleStyles";
import Location from "../components/Location";
import ModuleNavigation from "../components/ModuleNavigation";
import { Modal, Portal, Button, Provider, Checkbox, TextInput } from "react-native-paper";
import detailsStyles from "../styles/detailsStyles";
import { SettingModel } from "../models/Setting.model";

export default function SettingDetailsScreen( route: { setting: SettingModel } ) {

    const setting = route.setting;
    const navigation = useNavigation();
    const [name, onChangeName] = useState<string | undefined>(setting.name || 'Name');
    const [description, onChangeDescription] = useState<string | undefined>(setting.description || 'Description');
    const [type, onChangeType] = useState<string | undefined>(setting.type || 'Number');
    const [value, onChangeValue] = useState<string | undefined>(setting.value || 'Value');

    useEffect(() => {
        onChangeName(route.setting.name);
        onChangeDescription(route.setting.description);
        onChangeType(route.setting.type);
        onChangeValue(route.setting.value);
    }, [route]);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
        });
    });

    // Modal logic
    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

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
                    <Text style={detailsStyles.modalInfo}>Are you sure you want to change status of this setting?</Text>
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
                <Location location={`settings > ${setting.code}`}/>
                <ModuleNavigation elements={[
                    {text: 'Settings list', url: 'Setting'},
                    {text: 'Add new setting', url: 'SettingAdd'}
                ]} />
                <View style={moduleStyles.box}>
                    <Text style={moduleStyles.header}>Setting: {setting.name}</Text>
                    <Text style={detailsStyles.label}>Code:</Text>
                    <TextInput
                        style={detailsStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A', text: 'black'}}}
                        value={setting.code}
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
                    <Text style={detailsStyles.label}>Type:</Text>
                    <TextInput
                        style={detailsStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A', text: 'black'}}}
                        value={description}
                        onChangeText={onChangeDescription}
                    />
                    <Text style={detailsStyles.label}>Value:</Text>
                    <TextInput
                        style={detailsStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A', text: 'black'}}}
                        value={value}
                        onChangeText={onChangeValue}
                    />
                    <Text style={detailsStyles.label}>Created At:</Text>
                    <TextInput
                        style={detailsStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A', text: 'black'}}}
                        value={setting.createdAt || 'data utworzenia'}
                    />
                    <Text style={detailsStyles.label}>Updated At:</Text>
                    <TextInput
                        style={detailsStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A', text: 'black'}}}
                        value={setting.updatedAt || 'data modyfikacji'}
                    />
                    <Text style={detailsStyles.label}>Status:</Text>
                    <Button color={setting.status === 'ACTIVE' ? 'green' : 'red'}
                            labelStyle={detailsStyles.status}
                            onPress={showModal}>{setting.status || 'UNKNOW'}</Button>
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
                        Remove setting
                    </Button>
                </View>
            </View>
        </Provider>
    );
}
