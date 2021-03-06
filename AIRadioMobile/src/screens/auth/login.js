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
            images: [],
            emotions: [{x: 'anger', y: 0.2},{x: 'joy', y: 0.2},{x: 'suprise', y: 0.2},{x: 'sadness', y: 0.2},{x: 'fear', y: 0.2}],
            highestEmotions: ''
        };
        console.log(this);
        
    }
    componentDidMount(){
        this.props.socket.on('highestEmotion',(emotion)=>{
            this.setState({
                highestEmotions: emotion
            });
        });
        this.props.socket.on('emotions',(emotions)=>{
            let tempArray = [];
            let tempobject;
            for(let emotion in emotions){
                tempobject = { x: emotion , y: emotions[emotion]};
                tempArray.push(tempobject);
            }
            this.setState({
                emotions: tempArray
            });
            
            
        });
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
                        colorScale={['tomato', 'orange', 'gold', 'cyan', 'green','pink' ]}
                        data={this.state.emotions}
                        animate={{
                            duration: 2000
                        }}
                        width={width/1.05}
                        height={height/2}
                        labelRadius={115}
                        style={{ labels: { fill: 'black', fontSize: 18 } }}
                    />
                </View>
               
                <TextInput
                    placeholder="test"
                    style={styles.textInput}
                    onChangeText={text => this.setState({text})}/>
                
                <TouchableHighlight style={styles.submitButton} onPress={() => this.handlePersonnality(this.state.text)}>
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
