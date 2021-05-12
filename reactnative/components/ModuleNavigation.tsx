import { StyleSheet, Text} from "react-native";
import * as React from "react";
import { View } from "./Themed";
import { NavigationModel } from "../models/NavigationModel";
import { useNavigation } from "@react-navigation/native";
var { vw, vh } = require('react-native-viewport-units');

export default function ModuleNavigation(props: NavigationModel) {

    const navigation = useNavigation();

    return (
        <View style={styles.view}>
            {
                props.elements.map(el =>
                    <Text key={el.url} style={styles.text} onPress={
                    () => navigation.navigate("Root", { screen: el.url })
                }>{el.text}</Text>)
            }
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: 'orange',
        width: 90*vw,
        shadowColor: 'black',
        shadowRadius: 5,
        shadowOpacity: 0.2,
        marginTop: 2*vh,
        padding: 1*vh,
    },
    text: {
        backgroundColor: 'white',
        color: 'black',
        textAlign: 'center',
        margin: 1*vh,
        marginLeft: 2*vh,
        marginRight: 2*vh,
        padding: 1*vh
    }
});
