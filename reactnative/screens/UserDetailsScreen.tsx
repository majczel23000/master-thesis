import * as React from 'react';
import { View } from 'react-native';
import { useEffect } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useNavigation } from '@react-navigation/native';
import moduleStyles from "../styles/moduleStyles";
import Location from "../components/Location";
import ModuleNavigation from "../components/ModuleNavigation";

export default function UserDetailsScreen( route: { userId: string } ) {

    const userId = route.userId;

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
        });
    });

    return (
        <View style={moduleStyles.container}>
            <Location location={`users -> user id: ${userId}`}/>
            <ModuleNavigation elements={[
                {text: 'Users list', url: 'User'},
                {text: 'Add new user', url: 'UserAdd'}
            ]} />
        </View>
    );
}
