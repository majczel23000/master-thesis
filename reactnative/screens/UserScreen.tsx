import * as React from 'react';
import { View } from 'react-native';
import { useEffect } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useNavigation } from '@react-navigation/native';
import Location from "../components/Location";
import ModuleNavigation from "../components/ModuleNavigation";
import moduleStyles from "../styles/moduleStyles";
import { Searchbar, DataTable } from 'react-native-paper';
import {UserModel} from "../models/User.model";

export default function UserScreen() {

    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = (query: any) => setSearchQuery(query);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
        });
    });

    const users: UserModel[] = [
        {
            email: 'admin@admin.pl',
            status: 'ACTIVE',
            id: 1234,
            firstName: 'Admin',
            lastName: 'Adminiusz',
            roles: ['USERS_ADD', 'USERS_DELETE', 'USERS_ACTIVATE', 'ROLES_ADD', 'ROLES_DELETE', 'ROLES_ACTIVATE']
        },
        {
            email: 'admin1@admin.pl',
            status: 'ACTIVE',
            id: 12343,
        },
        {
            email: 'admin2@admin.pl',
            status: 'INACTIVE',
            id: 12354,
        },
        {
            email: 'admin3@admin.pl',
            status: 'ACTIVE',
            id: 1212334,
        },
        {
            email: 'admin4@admin.pl',
            status: 'ACTIVE',
            id: 1212334,
        }
    ];
    const [page, setPage] = React.useState(0);
    const itemsPerPage = 5;
    const from = page * itemsPerPage;
    const to = (page + 1) * itemsPerPage;

    return (
        <View style={moduleStyles.container}>
            <Location location={'users'}/>
            <ModuleNavigation elements={[
                {text: 'Add new user', url: 'UserAdd'}
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
                    <DataTable.Title>Email</DataTable.Title>
                    <DataTable.Title>Status</DataTable.Title>
                </DataTable.Header>

                {
                    users.slice(from, to).map(user =>
                        <DataTable.Row key={user.email} onPress={() => navigation.navigate("Root", { screen: 'UserDetails', params: { user: user }})}>
                            <DataTable.Cell>{user.email}</DataTable.Cell>
                            <DataTable.Cell>{user.status}</DataTable.Cell>
                        </DataTable.Row>
                    )
                }

                <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.floor(users.length / itemsPerPage)}
                    onPageChange={page => setPage(page)}
                    label={`${from + 1}-${to} of ${users.length}`}
                />
            </DataTable>
        </View>
    );
}
