import * as React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useCallback, useEffect, useState } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moduleStyles from "../styles/moduleStyles";
import Location from "../components/Location";
import ModuleNavigation from "../components/ModuleNavigation";
import {TextInput, Button, Snackbar} from "react-native-paper";
import { environment } from "../environment";
import { ImageResponseModel} from "../models/images/ImageResponse.model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageKeysEnum } from "../models/AsyncStorageKeys.enum";
import * as ImagePicker from 'expo-image-picker';
import detailsStyles from "../styles/detailsStyles";

export default function ImageAddScreen() {

    const [code, setCode] = React.useState<string>('');
    const [name, setName] = React.useState<string>('');
    const [imageData, setImageData] = React.useState<string>('');
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
        setImageData('');
        setCode('');
        setName('');
    }, []))

    const onDismissSnackBar = () => setVisibleSnackbar(false);

    const add = () => {
        setSubmitted(true);
        setError('');
        setSnackbarMsg('');
        if (!code.length || !name.length || !imageData.length) return;
        setIsLoadingBtn(true);
        AsyncStorage.getItem(AsyncStorageKeysEnum.TOKEN).then(result => {
            if (result !== null) {
                fetch(environment.apiUrl + 'images', {
                    method: 'POST',
                    headers: {
                        ...environment.headers,
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                    body: JSON.stringify({
                        code: code,
                        name: name,
                        image: imageData,
                    })
                })
                    .then(res => res.json())
                    .then((data: ImageResponseModel) => {
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

    const handleChoosePhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImageData(result.uri);
        }
    }


    return (
        <ScrollView>
            <View style={moduleStyles.container}>
                <Location location={`images > add `}/>
                <ModuleNavigation elements={[
                    {text: 'Images list', url: 'Image'}
                ]} />
                <View style={moduleStyles.box}>
                    <Text style={moduleStyles.header}>Add new image</Text>
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

                    {
                        imageData.length ? <Image
                            style={detailsStyles.img}
                            resizeMode={'contain'}
                            source={{
                                uri: imageData
                            }}
                        /> : null
                    }


                    <Button
                        mode="contained"
                        style={moduleStyles.btn}
                        onPress={handleChoosePhoto}>
                        Upload image
                    </Button>

                    <Button
                        mode="contained"
                        style={moduleStyles.btn}
                        onPress={add}
                        loading={isLoadingBtn}>
                        Add image
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
