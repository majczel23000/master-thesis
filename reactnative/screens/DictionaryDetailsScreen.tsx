import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Picker } from 'react-native';
import { useEffect } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useNavigation } from '@react-navigation/native';
import moduleStyles from "../styles/moduleStyles";
import Location from "../components/Location";
import ModuleNavigation from "../components/ModuleNavigation";
import { Modal, Portal, Button, Provider, Checkbox, TextInput } from "react-native-paper";
import detailsStyles from "../styles/detailsStyles";
import { DictionaryModel } from "../models/Dictionary.model";

export default function DictionaryDetailsScreen( route: { dictionary: DictionaryModel } ) {

    const dictionary = route.dictionary;
    const navigation = useNavigation();
    const [name, onChangeName] = useState<string | undefined>(dictionary.name || 'Name');
    const [description, onChangeDescription] = useState<string | undefined>(dictionary.description || 'Description');

    useEffect(() => {
        onChangeName(route.dictionary.name);
        onChangeDescription(route.dictionary.description);
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
                    <Text style={detailsStyles.modalInfo}>Are you sure you want to change status of this dictionary?</Text>
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
                <Location location={`dictionary > ${dictionary.code}`}/>
                <ModuleNavigation elements={[
                    {text: 'Dictionaries list', url: 'Dictionary'},
                    {text: 'Add new dictionary', url: 'DictionaryAdd'}
                ]} />
                <View style={moduleStyles.box}>
                    <Text style={moduleStyles.header}>Dictionary: {dictionary.name}</Text>
                    <Text style={detailsStyles.label}>Code:</Text>
                    <TextInput
                        style={detailsStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A', text: 'black'}}}
                        value={dictionary.code}
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
                        value={dictionary.createdAt || 'data utworzenia'}
                    />
                    <Text style={detailsStyles.label}>Updated At:</Text>
                    <TextInput
                        style={detailsStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A', text: 'black'}}}
                        value={dictionary.updatedAt || 'data modyfikacji'}
                    />
                    <Text style={detailsStyles.label}>Status:</Text>
                    <Button color={dictionary.status === 'ACTIVE' ? 'green' : 'red'}
                            labelStyle={detailsStyles.status}
                            onPress={showModal}>{dictionary.status || 'UNKNOW'}</Button>
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
                        Remove dictionary
                    </Button>
                </View>
            </View>
        </Provider>
    );
}
