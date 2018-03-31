import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Dimensions,
    TouchableHighlight,
    CameraRoll,
    Modal,
    Button,
    Image,
    ScrollView
} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import {VictoryPie} from 'victory-native';
import {appConnection, Context} from '../../util';

const {height, width} = Dimensions.get('window');

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            text: '',
            modalVisible: false,
            images: []
        };
        console.log(this);
    }
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    handlePersonnality(text) {
        appConnection(this.props.socket).personnality(text);
    }
    handleSendImage(image) {
        RNFetchBlob
            .fs
            .readFile(image, 'base64')
            .then((data) => {
                console.log(data);
                appConnection(this.props.socket).image(data);
            });
        this.setState({modalVisible: false});
    }
    render() {
        return (
            <View style={styles.container}>
                
                <View style={styles.chartContainter}>
                    <Text style={{fontSize:30}}>Emotions chart</Text>
                    <VictoryPie
                        colorScale={['tomato', 'orange', 'gold', 'cyan', 'navy' ]}
                        data={[
                            { x: 'Cats', y: 35 },
                            { x: 'Dogs', y: 40 },
                            { x: 'Birds', y: 55 }
                        ]}
                        animate={{
                            duration: 2000
                        }}
                        width={width/1.2}
                        height={height/2}
                        labelRadius={120}
                        style={{ labels: { fill: 'black', fontSize: 18 } }}
                    />
                </View>
               
                <TextInput
                    placeholder="test"
                    style={styles.textInput}
                    onChangeText={text => this.setState({text})}/>
                
                <TouchableHighlight onPress={() => this.handlePersonnality(this.state.text)}>
                    <View style={styles.submitButton}>
                        <Text style={{color:'white',fontSize:20}}>Submit</Text>
                    </View>
                </TouchableHighlight>
            </View>

        );
    }
}

export default class LoginData extends React.Component {
    render() {
        return (
            <Context.Consumer>
                {value => <Login socket={value}/>}
            </Context.Consumer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        alignItems: 'center',
        backgroundColor: '#fafafa'
    },
    chartContainter:{
        margin:20,
        height:height/1.6,
        width: width/1.1,
        backgroundColor:'white',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 2, 
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'column'
    },
    textInput:{
        height: 50,
        width:width/1.1,
        borderWidth:1,
        padding:10,
        borderRadius:5
    },
    submitButton:{
        margin:20,
        backgroundColor: '#1660C4',
        width:width/1.5,
        height:50,
        alignItems:'center',
        justifyContent:'center'
    },
    modalContainer: {
        paddingTop: 20,
        flex: 1
    },
    scrollView: {
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    shareButton: {
        position: 'absolute',
        width,
        padding: 10,
        bottom: 0,
        left: 0
    }
});
