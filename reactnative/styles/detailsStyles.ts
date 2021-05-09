import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    label: {
        width: '100%',
        backgroundColor: '#ddd',
        textAlign: 'center',
        padding: '1vh',
        fontSize: 16,
    },
    input: {
        border: 'none',
        backgroundColor: 'white',
        color: 'red',
        padding: 0,
        height: 50,
    },
    status: {
        fontSize: 20
    },
    modal: {
        margin: '5vw',
        padding: '3vw',
        minHeight: 100,
        backgroundColor: 'white'
    },
    modalTitle: {
        textAlign: 'center',
        fontSize: 22,
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        paddingBottom: '2vh',
        marginBottom: '2vh'
    },
    modalInfo: {
        textAlign: 'center',
        fontSize: 16
    },
    btnYes: {
        backgroundColor: 'green',
        marginTop: '2vh',
        marginBottom: '2vh'
    },
    btnNo: {
        backgroundColor: 'red'
    },
    img: {
        width: 300,
        height: 400,
    }
});
