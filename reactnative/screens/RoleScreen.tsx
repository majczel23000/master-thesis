import * as React from 'react';
import { View } from 'react-native';
import {useCallback, useEffect} from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Location from "../components/Location";
import ModuleNavigation from "../components/ModuleNavigation";
import moduleStyles from "../styles/moduleStyles";
import { Searchbar, DataTable, ActivityIndicator } from 'react-native-paper';
import { RoleModel } from "../models/roles/Role.model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AsyncStorageKeysEnum} from "../models/AsyncStorageKeys.enum";
import {environment} from "../environment";
import {RolesResponseModel} from "../models/roles/RolesResponse.model";

export default function RoleScreen() {

    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = (query: any) => setSearchQuery(query);
    const [roles, setRoles] = React.useState<RoleModel[]>([]);
    const [filteredRoles, setFilteredRoles] = React.useState<RoleModel[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);


    useEffect(() => {
        navigation.setOptions({
            headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
        });
    });

    useFocusEffect(useCallback( () => {
        setIsLoading(true);
        AsyncStorage.getItem(AsyncStorageKeysEnum.TOKEN).then(result => {
            if(result != null) {
                fetch(environment.apiUrl + 'roles', {
                    headers: {
                        Accept: 'application/json',
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                })
                    .then(res => res.json())
                    .then((data: RolesResponseModel) => {
                        //@ts-ignore
                        setRoles(data.data);
                        //@ts-ignore
                        setFilteredRoles(data.data);
                        setIsLoading(false);
                    })
            }
        })
    }, []))


    const applyFilter = (text: string) => {
        setSearchQuery(text);
        const tempUsers = roles.filter(role => {
            return role.code?.toUpperCase().includes(text.toUpperCase()) || role.status?.toUpperCase().includes(text.toUpperCase());
        });
        setFilteredRoles(tempUsers);
    }
    const [page, setPage] = React.useState(0);
    const itemsPerPage = 5;
    const from = page * itemsPerPage;
    const to = (page + 1) * itemsPerPage;

    return (
        <View style={moduleStyles.container}>
            <Location location={'roles'}/>
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
                        filteredRoles.slice(from, to).map(role =>
                            <DataTable.Row key={role.code} onPress={() => navigation.navigate("Root", { screen: 'RoleDetails', params: { role: role }})}>
                                <DataTable.Cell>{role.code}</DataTable.Cell>
                                <DataTable.Cell>{role.status}</DataTable.Cell>
                            </DataTable.Row>
                        )
                    }

                    <DataTable.Pagination
                        page={page}
                        numberOfPages={Math.floor(roles.length / itemsPerPage)}
                        onPageChange={page => setPage(page)}
                        label={`${from + 1}-${page + 1 === Math.ceil(filteredRoles.length / itemsPerPage) ? filteredRoles.length : to} of ${filteredRoles.length}`}
                    />
                </DataTable> : <ActivityIndicator animating={isLoading} color={'orange'} size={200}/>
            }
        </View>
    );
}
