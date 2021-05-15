import * as React from 'react';
import {Image, ScrollView, Text, View} from 'react-native';
import { useCallback, useEffect, useState } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moduleStyles from "../styles/moduleStyles";
import Location from "../components/Location";
import ModuleNavigation from "../components/ModuleNavigation";
import {Modal, Portal, Button, Provider, TextInput, ActivityIndicator, Snackbar} from "react-native-paper";
import detailsStyles from "../styles/detailsStyles";
import { ImageModel } from "../models/images/Image.model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageKeysEnum } from "../models/AsyncStorageKeys.enum";
import { environment } from "../environment";
import { ImageResponseModel } from "../models/images/ImageResponse.model";

export default function ImageDetailsScreen( route: { image: ImageModel } ) {

    const [image, setImage] = React.useState<ImageModel>({});
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [visibleModal, setVisibleModal] = React.useState<boolean>(false);
    const [visibleModalRemove, setVisibleModalRemove] = React.useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [snackbarMsg, setSnackbarMsg] = useState<string>('');
    const [visibleSnackbar, setVisibleSnackbar] = React.useState<boolean>(false);
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
        });
    });

    useFocusEffect(useCallback(() => {
        setIsLoading(true);
        setVisibleSnackbar(false);
        setSnackbarMsg('');
        setError('');
        AsyncStorage.getItem(AsyncStorageKeysEnum.TOKEN).then(result => {
            if (result !== null) {
                fetch(`${environment.apiUrl}images/${route.image._id}`, {
                    headers: {
                        Accept: 'application/json',
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                })
                    .then(res => res.json())
                    .then((imageData: ImageResponseModel) => {
                        // @ts-ignore
                        setImage(imageData.data);
                        setIsLoading(false);
                    })
            }
        });
    }, [route.image]));

    const showModal = () => setVisibleModal(true);
    const hideModal = () => setVisibleModal(false);
    const showModalRemove = () => setVisibleModalRemove(true);
    const hideModalRemove = () => setVisibleModalRemove(false);
    const onDismissSnackBar = () => setVisibleSnackbar(false);

    const remove = () => {
        AsyncStorage.getItem(AsyncStorageKeysEnum.TOKEN).then(result => {
            if (result !== null) {
                fetch(`${environment.apiUrl}images/${image._id}`, {
                    method: 'DELETE',
                    headers: {
                        ...environment.headers,
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                    body: JSON.stringify({})
                })
                    .then(res => res.json())
                    .then((resUpdateData: ImageResponseModel) => {
                        setVisibleModalRemove(false);
                        navigation.navigate("Root", { screen: 'Image' });
                    })
            }
        })
    }

    const changeStatus = () => {
        AsyncStorage.getItem(AsyncStorageKeysEnum.TOKEN).then(result => {
            if (result !== null) {
                const url = image.status === 'INACTIVE' ? `${environment.apiUrl}images/${image._id}/activate` : `${environment.apiUrl}images/${image._id}/deactivate`;
                fetch(url, {
                    method: 'POST',
                    headers: {
                        ...environment.headers,
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                    body: JSON.stringify({})
                })
                    .then(res => res.json())
                    .then((resUpdateData: ImageResponseModel) => {
                        setImage(resUpdateData.data as ImageModel);
                        setVisibleModal(false);
                        if (parseInt(resUpdateData.code as string) !== 200) {
                            setError(resUpdateData.message as string);
                        } else {
                            setSnackbarMsg(resUpdateData.message as string);
                        }
                        setVisibleSnackbar(true);
                    })
            }
        })
    }

    return (
        <Provider>
            <Portal>
                <Modal
                    visible={visibleModal}
                    onDismiss={hideModal}
                    contentContainerStyle={detailsStyles.modal}>
                    <Text style={detailsStyles.modalTitle}>Change Status</Text>
                    <Text style={detailsStyles.modalInfo}>Are you sure you want to change status of this image?</Text>
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
            <Portal>
                <Modal
                    visible={visibleModalRemove}
                    onDismiss={hideModal}
                    contentContainerStyle={detailsStyles.modal}>
                    <Text style={detailsStyles.modalTitle}>Remove image</Text>
                    <Text style={detailsStyles.modalInfo}>Are you sure you want to remove this image?</Text>
                    <Button
                        mode="contained"
                        style={detailsStyles.btnYes}
                        onPress={remove}>
                        Yes
                    </Button>
                    <Button
                        mode="contained"
                        style={detailsStyles.btnNo}
                        onPress={hideModalRemove}>
                        No
                    </Button>
                </Modal>
            </Portal>
            <ScrollView>
                <View style={moduleStyles.container}>
                    <Location location={`images > ${image.code}`}/>
                    <ModuleNavigation elements={[
                        {text: 'Images list', url: 'Image'},
                        {text: 'Images add', url: 'ImageAdd'}
                    ]} />
                    {
                        !isLoading ? <View style={moduleStyles.box}>
                            <Text style={moduleStyles.header}>Image: {image.code}</Text>
                            <Text style={detailsStyles.label}>Code: </Text>
                            <TextInput
                                style={detailsStyles.input}
                                underlineColor={'#DB995A'}
                                selectionColor={'#DB995A'}
                                theme={{colors: {primary: '#DB995A', text: 'black'}}}
                                value={image.code}
                            />
                            <Text style={detailsStyles.label}>Name:</Text>
                            <TextInput
                                style={detailsStyles.input}
                                underlineColor={'#DB995A'}
                                selectionColor={'#DB995A'}
                                theme={{colors: {primary: '#DB995A', text: 'black'}}}
                                value={image.name}
                            />
                            <Text style={detailsStyles.label}>Created At:</Text>
                            <TextInput
                                style={detailsStyles.input}
                                underlineColor={'#DB995A'}
                                selectionColor={'#DB995A'}
                                theme={{colors: {primary: '#DB995A', text: 'black'}}}
                                value={image.createdAt || 'data utworzenia'}
                            />
                            <Text style={detailsStyles.label}>Updated At:</Text>
                            <TextInput
                                style={detailsStyles.input}
                                underlineColor={'#DB995A'}
                                selectionColor={'#DB995A'}
                                theme={{colors: {primary: '#DB995A', text: 'black'}}}
                                value={image.updatedAt || 'data modyfikacji'}
                            />
                            <Text style={detailsStyles.label}>Image:</Text>
                            <Image
                                style={detailsStyles.img}
                                resizeMode={'contain'}
                                source={{
                                    uri: image.image
                                }}
                            />
                            <Text style={detailsStyles.label}>Status:</Text>
                            <Button color={image.status === 'ACTIVE' ? 'green' : 'red'}
                                    labelStyle={detailsStyles.status}
                                    onPress={showModal}>{image.status || 'UNKNOW'}</Button>
                            <Button
                                mode="contained"
                                style={moduleStyles.btnRemove}
                                onPress={showModalRemove}>
                                Remove
                            </Button>
                        </View> : <ActivityIndicator animating={isLoading} color={'orange'} size={200}/>
                    }
                    <Snackbar
                        visible={visibleSnackbar}
                        style={error?.length ? moduleStyles.snackbarError : snackbarMsg?.length ? moduleStyles.snackbarMsg : null }
                        onDismiss={onDismissSnackBar}
                        duration={3000}>
                        {error?.length ? error : snackbarMsg?.length ? snackbarMsg : ''}
                    </Snackbar>
                </View>
            </ScrollView>
        </Provider>
    );
}
