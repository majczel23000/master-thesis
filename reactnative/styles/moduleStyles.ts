import { StyleSheet } from 'react-native';
var { vw, vh } = require('react-native-viewport-units');

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fafafa',
        paddingTop: 2*vh
    },
    box: {
        width: 90*vw,
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowRadius: 10,
        shadowOpacity: 0.2,
        borderRadius: 5,
        paddingTop: 3*vh,
        paddingBottom: 3*vh,
        paddingLeft: 4*vh,
        paddingRight: 4*vh,
        marginTop: 20,
        marginBottom: 2*vh,
    },
    header: {
        fontSize: 25,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 2*vh
    },
    filter: {
        width: 90*vw,
        borderRadius: 0,
        shadowRadius: 0,
        shadowOpacity: 0,
        backgroundColor: 'rgb(250, 250, 250)',
        marginTop: 2*vh,
        height: 5*vh
    },
    filterText: {
        fontSize: 14
    },
    input: {
        backgroundColor: 'white',
    },
    info: {
        color: 'gray',
        fontSize: 11,
        padding: 2
    },
    btn: {
        backgroundColor: '#DB995A',
        marginTop: 5*vh,
        shadowRadius: 3,
        shadowOpacity: 0.2,
        borderRadius: 3,
    },
    btnClear: {
       backgroundColor: 'gray',
        marginTop: 2*vh,
    },
    btnRemove: {
        backgroundColor: 'red',
        marginTop: 2*vh,
    },
    btnYes: {
        backgroundColor: 'green',
        marginTop: 2*vh,
    },
    img: {
        width: 100,
        height: 100,
    },
    snackbarError: {
        backgroundColor: 'red',
        color: 'white'
    },
    snackbarMsg: {
        backgroundColor: 'orange',
        color: 'white',
    }
});
