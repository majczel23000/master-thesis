import * as React from 'react';
import { Image, Text, View } from 'react-native';
import { useCallback, useEffect, useState } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moduleStyles from "../styles/moduleStyles";
import Location from "../components/Location";
import ModuleNavigation from "../components/ModuleNavigation";
import { Modal, Portal, Button, Provider, TextInput } from "react-native-paper";
import detailsStyles from "../styles/detailsStyles";
import { ImageModel } from "../models/images/Image.model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageKeysEnum } from "../models/AsyncStorageKeys.enum";
import { environment } from "../environment";
import { ImageResponseModel } from "../models/images/ImageResponse.model";

export default function ImageDetailsScreen( route: { image: ImageModel } ) {


    const [image, setImage] = React.useState<ImageModel>({});
    const [name, setName] = React.useState<string>(route.image.name || 'Name');
    const [imageUploaded, setImageUploaded] = React.useState<string>(route.image.imageUploaded || 'ImageUploaded');

    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [visibleModal, setVisibleModal] = React.useState<boolean>(false);
    const [visibleModalRemove, setVisibleModalRemove] = React.useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [snackbarMsg, setSnackbarMsg] = useState<string>('');
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [visibleSnackbar, setVisibleSnackbar] = React.useState<boolean>(false);
    const [isLoadingModifyBtn, setIsLoadingModifyBtn] = React.useState<boolean>(false);


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
                fetch(`${environment.apiUrl}roles/${route.image._id}`, {
                    headers: {
                        Accept: 'application/json',
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                })
                    .then(res => res.json())
                    .then((imageData: ImageResponseModel) => {
                        // @ts-ignore
                        setImage(imageData.data);
                        setName(imageData.data?.name as string);
                        setImage(imageData.data?.imageUploaded as string);
                    })
                setIsLoading(false);
            }
        });
    }, [route.image]))


    const navigation = useNavigation();


    // Modal logic
    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const save = () => {

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
            <View style={moduleStyles.container}>
                <Location location={`images > ${img.code}`}/>
                <ModuleNavigation elements={[
                    {text: 'Images list', url: 'Image'},
                    {text: 'Images add', url: 'ImageAdd'}
                ]} />
                <View style={moduleStyles.box}>
                    <Text style={moduleStyles.header}>Image: {img.code}</Text>
                    <Text style={detailsStyles.label}>Code: </Text>
                    <TextInput
                        style={detailsStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A', text: 'black'}}}
                        value={img.code}
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
                    <Text style={detailsStyles.label}>Created At:</Text>
                    <TextInput
                        style={detailsStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A', text: 'black'}}}
                        value={img.createdAt || 'data utworzenia'}
                    />
                    <Text style={detailsStyles.label}>Updated At:</Text>
                    <TextInput
                        style={detailsStyles.input}
                        underlineColor={'#DB995A'}
                        selectionColor={'#DB995A'}
                        theme={{colors: {primary: '#DB995A', text: 'black'}}}
                        value={img.updatedAt || 'data modyfikacji'}
                    />
                    <Text style={detailsStyles.label}>Image:</Text>
                    <Image
                        style={detailsStyles.img}
                        source={{
                            uri: img.image
                        }}
                    />
                    <Text style={detailsStyles.label}>Status:</Text>
                    <Button color={img.status === 'ACTIVE' ? 'green' : 'red'}
                            labelStyle={detailsStyles.status}
                            onPress={showModal}>{img.status || 'UNKNOW'}</Button>
                    <Button
                        mode="contained"
                        style={moduleStyles.btn}
                        onPress={save}>
                        Save changes
                    </Button>
                    <Button
                        mode="contained"
                        style={moduleStyles.btnRemove}>
                        Remove
                    </Button>
                </View>
            </View>
        </Provider>
    );
}
