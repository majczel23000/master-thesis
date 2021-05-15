import { StyleSheet } from 'react-native';
let { vw, vh } = require('react-native-viewport-units');

export default StyleSheet.create({
    label: {
        width: '100%',
        backgroundColor: '#ddd',
        textAlign: 'center',
        padding: 1*vh,
        fontSize: 16,
    },
    input: {
        backgroundColor: 'white',
        color: 'red',
        padding: 0,
        height: 50,
    },
    status: {
        fontSize: 20
    },
    modal: {
        margin: 5*vw,
        padding: 3*vw,
        minHeight: 100,
        backgroundColor: 'white'
    },
    modalTitle: {
        textAlign: 'center',
        fontSize: 22,
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        paddingBottom: 2*vh,
        marginBottom: 2*vh
    },
    modalInfo: {
        textAlign: 'center',
        fontSize: 16
    },
    btnYes: {
        backgroundColor: 'green',
        marginTop: 2*vh,
        marginBottom: 2*vh
    },
    btnNo: {
        backgroundColor: 'red'
    },
    img: {
        flex: 1,
        alignSelf: 'stretch',
        height: 40*vh,
    }
});
