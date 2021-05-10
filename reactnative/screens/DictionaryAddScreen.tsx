import * as React from 'react';
import { View, Text } from 'react-native';
import { useEffect } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useNavigation } from '@react-navigation/native';
import moduleStyles from "../styles/moduleStyles";
import Location from "../components/Location";
import ModuleNavigation from "../components/ModuleNavigation";
import { TextInput, Button } from "react-native-paper";

export default function DictionaryAddScreen() {

    const add = () => {
        console.log(add);
    }

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
        });
    });

    return (
        <View style={moduleStyles.container}>
            <Location location={`dictionary > add `}/>
            <ModuleNavigation elements={[
                {text: 'Dictionaries list', url: 'Dictionary'}
            ]} />
            <View style={moduleStyles.box}>
                <Text style={moduleStyles.header}>Add new dictionary</Text>
                <TextInput
                    label="Code"
                    style={moduleStyles.input}
                    underlineColor={'#DB995A'}
                    selectionColor={'#DB995A'}
                    theme={{colors: {primary: '#DB995A'}}}
                />
                <Text style={moduleStyles.info}>Type code here</Text>
                <TextInput
                    label="Name"
                    style={moduleStyles.input}
                    underlineColor={'#DB995A'}
                    selectionColor={'#DB995A'}
                    theme={{colors: {primary: '#DB995A'}}}
                />
                <Text style={moduleStyles.info}>Type name here</Text>
                <TextInput
                    label="Description"
                    style={moduleStyles.input}
                    underlineColor={'#DB995A'}
                    selectionColor={'#DB995A'}
                    theme={{colors: {primary: '#DB995A'}}}
                />
                <Text style={moduleStyles.info}>Type description here</Text>

                <Button
                    mode="contained"
                    style={moduleStyles.btn}
                    onPress={add}>
                    Add dictionary
                </Button>
            </View>
        </View>
    );
}
