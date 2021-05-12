import { StyleSheet, Text} from "react-native";
import * as React from "react";
import { View } from "./Themed";
import { LocationModel } from "../models/LocationModel";
var { vw } = require('react-native-viewport-units');

export default function Location(props: LocationModel) {

    return (
        <View style={styles.view}>
            <Text style={styles.text}>Location: {props.location}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: 'rgb(250, 250, 250)',
    },
    text: {
        fontFamily: 'Consolas',
        textAlign: 'left',
        width: 90*vw,
        fontSize: 16
    }
});
