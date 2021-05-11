import * as React from 'react';
import { View } from 'react-native';
import { useEffect } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useNavigation } from '@react-navigation/native';
import Location from "../components/Location";
import moduleStyles from "../styles/moduleStyles";
import { Searchbar, DataTable } from 'react-native-paper';
import { RoleModel } from "../models/roles/Role.model";

export default function RoleScreen() {

    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = (query: any) => setSearchQuery(query);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
        });
    });

    const roles: RoleModel[] = [
        {
            code: 'USERS_ADD',
            name: 'Users add',
            status: 'ACTIVE'
        },
        {
            code: 'USERS_ACTIVATE',
            name: 'Users add',
            status: 'ACTIVE'
        },
        {
            code: 'USERS_MODIFY',
            name: 'Users add',
            status: 'INACTIVE'
        },
        {
            code: 'USERS_UPDATE',
            name: 'Users add',
            status: 'ACTIVE'
        },
        {
            code: 'USERS_DELETE',
            name: 'Users add',
            status: 'ACTIVE'
        }
    ];
    const [page, setPage] = React.useState(0);
    const itemsPerPage = 5;
    const from = page * itemsPerPage;
    const to = (page + 1) * itemsPerPage;

    return (
        <View style={moduleStyles.container}>
            <Location location={'roles'}/>
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
                    <DataTable.Title>Status</DataTable.Title>
                </DataTable.Header>

                {
                    roles.slice(from, to).map(role =>
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
                    label={`${from + 1}-${to} of ${roles.length}`}
                />
            </DataTable>
        </View>
    );
}
