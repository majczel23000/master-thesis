import * as React from 'react';
import {View, Text, ScrollView} from 'react-native';
import {useCallback, useEffect, useState} from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import moduleStyles from "../styles/moduleStyles";
import Location from "../components/Location";
import ModuleNavigation from "../components/ModuleNavigation";
import {TextInput, Button, Snackbar} from "react-native-paper";
import {environment} from "../environment";
import { FaqResponseModel } from "../models/faqs/FaqResponse.model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AsyncStorageKeysEnum} from "../models/AsyncStorageKeys.enum";

export default function FaqAddScreen() {
    const [name, setName] = React.useState<string>('');
    const [code, setCode] = React.useState<string>('');
    const [description, setDescription] = React.useState<string>('');
    const [error, setError] = useState<string | undefined>('');
    const [snackbarMsg, setSnackbarMsg] = useState<string | undefined>('');
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [visibleSnackbar, setVisibleSnackbar] = React.useState<boolean>(false);
    const [isLoadingBtn, setIsLoadingBtn] = React.useState<boolean>(false);

    const onDismissSnackBar = () => setVisibleSnackbar(false);

    const add = () => {
        setSubmitted(true);
        setError('');
        setSnackbarMsg('');
        if (!name.length || !code.length || !description.length) return;
        const rolesNames: string[] = [];
        setIsLoadingBtn(true);
        AsyncStorage.getItem(AsyncStorageKeysEnum.TOKEN).then(result => {
            if (result !== null) {
                fetch(environment.apiUrl + 'faqs', {
                    method: 'POST',
                    headers: {
                        ...environment.headers,
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                    body: JSON.stringify({
                        code: code,
                        name: name,
                        description: description,
                    })
                })
                    .then(res => res.json())
                    .then((data: FaqResponseModel) => {
                        setIsLoadingBtn(false);
                        if (parseInt(data.code as string) !== 200) {
                            setError(data.message);
                        } else {
                            setSnackbarMsg(data.message);
                        }
                        setVisibleSnackbar(true);
                    })
            }
        });
    }

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
        setDescription('');
        setName('');
        setSubmitted(false);
    }, []))

    return (
        <ScrollView>
            <View style={moduleStyles.container}>
                <Location location={`faq > add `}/>
                <ModuleNavigation elements={[
                    {text: 'Faqs list', url: 'Faq'}
                ]} />
                <View style={moduleStyles.box}>
                    <Text style={moduleStyles.header}>Add new faq</Text>
                    <TextInput
                        label="Code"
                        style={moduleStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A'}}}
                        value={code}
                        onChangeText={setCode}
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
                        error={submitted && !description.length}
                    />
                    <Text style={moduleStyles.info}>Type description here</Text>

                    <Button
                        mode="contained"
                        style={moduleStyles.btn}
                        onPress={add}
                        loading={isLoadingBtn}>
                        Add faq
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
