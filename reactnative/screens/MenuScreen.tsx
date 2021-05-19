import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { useCallback, useEffect } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Location from "../components/Location";
import ModuleNavigation from "../components/ModuleNavigation";
import moduleStyles from "../styles/moduleStyles";
import { Searchbar, DataTable, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageKeysEnum } from "../models/AsyncStorageKeys.enum";
import { environment } from "../environment";
import { MenuModel } from "../models/menu/Menu.model";
import {MenuListResponseModel} from "../models/menu/MenuListResponse.model";

export default function MenuScreen() {

    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [menus, setMenus] = React.useState<MenuModel[]>([]);
    const [filteredMenus, setFilteredMenus] = React.useState<MenuModel[]>([]);
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
                fetch(environment.apiUrl + 'menus', {
                    headers: {
                        Accept: 'application/json',
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                })
                    .then(res => res.json())
                    .then((data: MenuListResponseModel) => {
                        // @ts-ignore
                        setMenus(data.data);
                        // @ts-ignore
                        setFilteredMenus(data.data);
                        setIsLoading(false);
                    })
            }
        });
    }, []))

    const applyFilter = (text: string) => {
        setSearchQuery(text);
        const tempMenu = menus.filter(menu => {
            return menu.code?.toUpperCase().includes(text.toUpperCase()) || menu.status?.toUpperCase().includes(text.toUpperCase());
        });
        setFilteredMenus(tempMenu);
    }

    const goToDetails = (menu: MenuModel) => {
        navigation.navigate("Root", { screen: 'MenuDetails', params: { menu: menu }})
    }

    const [page, setPage] = React.useState(0);
    const itemsPerPage = 5;
    const from = page * itemsPerPage;
    const to = (page + 1) * itemsPerPage;

    return (
        <ScrollView>
            <View style={moduleStyles.container}>
                <Location location={'menu'}/>
                <ModuleNavigation elements={[
                    {text: 'Add new menu', url: 'MenuAdd'}
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
                            <DataTable.Title>Status</DataTable.Title>
                        </DataTable.Header>

                        {
                            filteredMenus.slice(from, to).map(menu =>
                                <DataTable.Row key={menu.code} onPress={() => goToDetails(menu)}>
                                    <DataTable.Cell>{menu.code}</DataTable.Cell>
                                    <DataTable.Cell>{menu.status}</DataTable.Cell>
                                </DataTable.Row>
                            )
                        }

                        <DataTable.Pagination
                            page={page}
                            numberOfPages={Math.floor(filteredMenus.length / itemsPerPage)}
                            onPageChange={page => setPage(page)}
                            label={`${from + 1}-${page + 1 === Math.ceil(filteredMenus.length / itemsPerPage) ? filteredMenus.length : to} of ${filteredMenus.length}`}
                        />
                    </DataTable> : <ActivityIndicator animating={isLoading} color={'orange'} size={200}/>
                }
            </View>
        </ScrollView>
    );
}
