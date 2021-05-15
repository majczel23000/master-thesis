import * as React from 'react';
import { Image, View } from 'react-native';
import { useCallback, useEffect } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ImageModel } from "../models/images/Image.model";
import moduleStyles from "../styles/moduleStyles";
import Location from "../components/Location";
import { ActivityIndicator, DataTable, Searchbar } from "react-native-paper";
import ModuleNavigation from "../components/ModuleNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageKeysEnum } from "../models/AsyncStorageKeys.enum";
import { environment } from "../environment";
import { ImageListResponseModel } from "../../cms-pwa/src/app/shared/models/image/ImageListResponse.model";

export default function ImageScreen() {

    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [images, setImages] = React.useState<ImageModel[]>([]);
    const [filteredImages, setfFilteredImages] = React.useState<ImageModel[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
        });
    });

    useFocusEffect(useCallback(() => {
        setIsLoading(true);
        AsyncStorage.getItem(AsyncStorageKeysEnum.TOKEN).then(result => {
            if (result !== null) {
                fetch(environment.apiUrl + 'images', {
                    headers: {
                        Accept: 'application/json',
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                })
                    .then(res => res.json())
                    .then((data: ImageListResponseModel) => {
                        // @ts-ignore
                        setImages(data.data);
                        // @ts-ignore
                        setfFilteredImages(data.data);
                        setIsLoading(false);
                    })
            }
        });
    }, []))

    const applyFilter = (text: string) => {
        setSearchQuery(text);
        const tempImages = images.filter(img => {
            return img.code?.toUpperCase().includes(text.toUpperCase());
        });
        setfFilteredImages(tempImages);
    }

    const goToDetails = (image: ImageModel) => {
        navigation.navigate("Root", { screen: 'ImageDetails', params: { image: image }})
    }

    const [page, setPage] = React.useState(0);
    const itemsPerPage = 5;
    const from = page * itemsPerPage;
    const to = (page + 1) * itemsPerPage;

    return (
        <View style={moduleStyles.container}>
            <Location location={'images'}/>
            <ModuleNavigation elements={[
                {text: 'Add new image', url: 'ImageAdd'}
            ]} />
            <Searchbar
                placeholder="Filter"
                onChangeText={(text) => applyFilter(text)}
                style={moduleStyles.filter}
                inputStyle={moduleStyles.filterText}
                value={searchQuery}
            />

            {
                !isLoading ? <DataTable style={moduleStyles.box}>
                    <DataTable.Header>
                        <DataTable.Title>Code</DataTable.Title>
                        <DataTable.Title>Image</DataTable.Title>
                    </DataTable.Header>

                    {
                        filteredImages.slice(from, to).map(img =>
                            <DataTable.Row key={img.code} onPress={() => goToDetails(img)}>
                                <DataTable.Cell>{img.code}</DataTable.Cell>
                                <DataTable.Cell>
                                    <View>
                                        <Image
                                            style={moduleStyles.img}
                                            source={{
                                                uri: img.image
                                            }}
                                        />
                                    </View>
                                </DataTable.Cell>
                            </DataTable.Row>
                        )
                    }

                    <DataTable.Pagination
                        page={page}
                        numberOfPages={Math.floor(images.length / itemsPerPage)}
                        onPageChange={page => setPage(page)}
                        label={`${from + 1}-${page + 1 === Math.ceil(filteredImages.length / itemsPerPage) ? filteredImages.length : to} of ${filteredImages.length}`}
                    />
                </DataTable> : <ActivityIndicator animating={isLoading} color={'orange'} size={200}/>
            }
        </View>
    );
}
