import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useCallback, useEffect, useState } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moduleStyles from "../styles/moduleStyles";
import Location from "../components/Location";
import ModuleNavigation from "../components/ModuleNavigation";
import { TextInput, Button, Snackbar } from "react-native-paper";
import { environment } from "../environment";
import { SettingResponseModel } from "../models/settings/SettingResponse.model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageKeysEnum } from "../models/AsyncStorageKeys.enum";


export default function SettingAddScreen() {

    const [code, setCode] = React.useState<string>('');
    const [name, setName] = React.useState<string>('');
    const [description, setDescription] = React.useState<string>('');
    const [type, setType] = React.useState<string>('');
    const [value, setValue] = React.useState<string>('');
    const [error, setError] = useState<string | undefined>('');
    const [snackbarMsg, setSnackbarMsg] = useState<string | undefined>('');
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [visibleSnackbar, setVisibleSnackbar] = React.useState<boolean>(false);
    const [isLoadingBtn, setIsLoadingBtn] = React.useState<boolean>(false);
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
        });
    });

    useFocusEffect(useCallback(() => {
        setVisibleSnackbar(false);
        setSnackbarMsg('');
        setError('');
        setCode('');
        setName('');
        setDescription('');
        setType('');
        setValue('');
    }, []))


    const onDismissSnackBar = () => setVisibleSnackbar(false);

    const add = () => {
        setSubmitted(true);
        setError('');
        setSnackbarMsg('');
        if (!code.length || !name.length || !description.length || !type.length || !value.length) return;
        setIsLoadingBtn(true);
        AsyncStorage.getItem(AsyncStorageKeysEnum.TOKEN).then(result => {
            if (result !== null) {
                fetch(environment.apiUrl + 'settings', {
                    method: 'POST',
                    headers: {
                        ...environment.headers,
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                    body: JSON.stringify({
                        code: code,
                        name: name,
                        description: description,
                        type: type,
                        value: value,
                    })
                })
                    .then(res => res.json())
                    .then((data: SettingResponseModel) => {
                        setIsLoadingBtn(false);
                        if (parseInt(data.code as string) !== 200) {
                            setError(data.message);
                        } else {
                            setSnackbarMsg(data.message);
                        }
                        setVisibleSnackbar(true);
                    })
            }
        })
    }

    return (
        <ScrollView>
            <View style={moduleStyles.container}>
                <Location location={`settings > add `}/>
                <ModuleNavigation elements={[
                    {text: 'Settings list', url: 'Setting'}
                ]} />
                <View style={moduleStyles.box}>
                    <Text style={moduleStyles.header}>Add new setting</Text>
                    <TextInput
                        label="Code"
                        style={moduleStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A'}}}
                        value={code}
                        onChangeText={setCode}
                        autoCorrect={false}
                        error={submitted && !code.length}
                    />
                    <Text style={moduleStyles.info}>Type code here</Text>
                    <TextInput
                        label="Name"
                        style={moduleStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A'}}}
                        value={name}
                        onChangeText={setName}
                        autoCorrect={false}
                        error={submitted && !name.length}
                    />
                    <Text style={moduleStyles.info}>Type name here</Text>
                    <TextInput
                        label="Description"
                        style={moduleStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A'}}}
                        value={description}
                        onChangeText={setDescription}
                        autoCorrect={false}
                        error={submitted && !description.length}
                    />
                    <Text style={moduleStyles.info}>Type description here</Text>
                    <TextInput
                        label="Type"
                        style={moduleStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A'}}}
                        value={type}
                        onChangeText={setType}
                        autoCorrect={false}
                        error={submitted && !type.length}
                    />
                    <Text style={moduleStyles.info}>String, Boolean or Number type </Text>
                    <TextInput
                        label="Value"
                        style={moduleStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A'}}}
                        value={value}
                        onChangeText={setValue}
                        autoCorrect={false}
                        error={submitted && !value.length}
                    />
                    <Text style={moduleStyles.info}>Type value here</Text>

                    <Button
                        mode="contained"
                        style={moduleStyles.btn}
                        onPress={add}
                        loading={isLoadingBtn}>
                        Add setting
                    </Button>
                </View>
                <Snackbar
                    visible={visibleSnackbar}
                    style={error?.length ? moduleStyles.snackbarError : snackbarMsg?.length ? moduleStyles.snackbarMsg : null }
                    onDismiss={onDismissSnackBar}
                    duration={3000}>
                    {error?.length ? error : snackbarMsg?.length ? snackbarMsg : ''}
                </Snackbar>
            </View>
    </ScrollView>
    );
}
