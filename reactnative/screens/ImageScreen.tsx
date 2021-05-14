import * as React from 'react';
import { Image, View } from 'react-native';
import { useEffect } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useNavigation } from '@react-navigation/native';
import { ImageModel } from "../models/images/Image.model";
import moduleStyles from "../styles/moduleStyles";
import Location from "../components/Location";
import { DataTable, Searchbar } from "react-native-paper";
import ModuleNavigation from "../components/ModuleNavigation";

export default function ImageScreen() {

    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = (query: any) => setSearchQuery(query);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
        });
    });

    const images: ImageModel[] = [
        {
            code: 'USERS_ADD',
            name: 'adding users',
            status: 'active',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg=='
        },
        {
            code: 'USERS_ADD2',
            name: 'adding users2',
            status: 'active',
            image: ''
        },
        {
            code: 'USERS_ADD3',
            name: 'adding users3',
            status: 'active',
            image: ''
        },
        {
            code: 'USERS_ADD4',
            name: 'adding users4',
            status: 'active',
            image: ''
        },
    ];
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
                onChangeText={onChangeSearch}
                style={moduleStyles.filter}
                inputStyle={moduleStyles.filterText}
                value={searchQuery}
            />
            <DataTable style={moduleStyles.box}>
                <DataTable.Header>
                    <DataTable.Title>Code</DataTable.Title>
                    <DataTable.Title>Name</DataTable.Title>
                    <DataTable.Title>Status</DataTable.Title>
                    <DataTable.Title>Image</DataTable.Title>
                </DataTable.Header>

                {
                    images.slice(from, to).map(img =>
                        <DataTable.Row key={img.code} onPress={() => navigation.navigate("Root", { screen: 'ImageDetails', params: { image: img }})}>
                            <DataTable.Cell>{img.code}</DataTable.Cell>
                            <DataTable.Cell>{img.name}</DataTable.Cell>
                            <DataTable.Cell>{img.status}</DataTable.Cell>
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
                    label={`${from + 1}-${to} of ${images.length}`}
                />
            </DataTable>
        </View>
    );
}
