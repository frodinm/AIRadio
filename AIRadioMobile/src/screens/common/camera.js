import React from 'react';
import { StyleSheet, Text, View, TextInput,Dimensions, TouchableHighlight, CameraRoll,Modal,Button,Image,ScrollView,TouchableOpacity,StatusBar,Platform } from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import IOSicon from 'react-native-vector-icons/dist/Ionicons';
import MaterialIcon from 'react-native-vector-icons/dist/MaterialIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import flashon from '../../assets/camera/ic_flash_on_white.png';
import flashoff from '../../assets/camera/ic_flash_off_white.png';
import { RNCamera } from 'react-native-camera';
import {appConnection,Context} from '../../util';


const {height,width} = Dimensions.get('window');


class Camera extends React.Component {
    constructor(){
        super();
        this.state = {
            camera: {

                type: RNCamera.Constants.Type.front,
                
                torchMode: RNCamera.Constants.FlashMode.torch,
            }
        };
        this.switchTorch = this.switchTorch.bind(this);
    }

    flashIcon() {
        let icon;
        const {on,off} = RNCamera.Constants.FlashMode;
        if (this.state.camera.torchMode === on) {
            icon = flashon;
        } else if (this.state.camera.torchMode === off) {
            icon = flashoff;
        }

        return icon;
    }

    switchTorch() {
        let newTorchMode;
        const {on, off} = RNCamera.Constants.FlashMode;

        if (this.state.camera.torchMode === on) {
            newTorchMode = off;
        } else if (this.state.camera.torchMode === off) {
            newTorchMode = on;
        }
        this.setState({
            camera: {
                ...this.state.camera,
                torchMode: newTorchMode
            }
        });
    }
    switchCamera(){
        let type;
        let {front,back} = RNCamera.Constants.Type;
        
        if(Platform.OS === 'android'){
            if(this.state.camera.type === 0){
                type = front;
            }else{
                type = back;
            }
        }else{
            if(this.state.camera.type === 1){
                type = front;
            }else{
                type = back;
            } 
        }

        this.setState({
            camera:{
                type
            }
        });
        
    }
    
    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    animated
                    hidden/>

                <RNCamera
                    ref={(cam) => {
                        this.camera = cam;
                    }}
                    autoFocus="on"
                    style={styles.preview}
                    type={this.state.camera.type}
                    torchMode={this.state.camera.torchMode}
                    permissionDialogTitle={'Permission to use camera'}
                    permissionDialogMessage={'We need your permission to use your camera phone'}
                >
                    <View >
                        <TouchableOpacity style={styles.flashButton} onPress={() => this.switchCamera()}>
                            <MaterialIcon name="switch-camera" color="white" size={35}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.closeButton}>
                        <TouchableOpacity onPress={()=>{this.props.navigation.goBack();}}>
                            <IOSicon name="ios-close" color="white" size={35}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.snap}>
                        <TouchableOpacity onPress={()=>this.takePicture()}>
                            <FontIcon name="camera-retro" color="white" size={35}/>
                        </TouchableOpacity>
                    </View>
                </RNCamera>
            </View>
        );
    }
    takePicture = async function() {
        if (this.camera) {
            const options = {  quality: 0.5, base64: true };
            const data = await this.camera.takePictureAsync(options);
            console.log(data);
        
            CameraRoll.saveToCameraRoll(data.uri,'photo');
           
            appConnection(this.props.socket).image(data.base64);
            this.props.navigation.navigate('app');
        }
    };
}

export default class CameraData extends React.Component{
    render(){
        const {props} = this;
        return(
            <Context.Consumer>
                {value=> <Camera {...props} socket={value}/>}
            </Context.Consumer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    preview: {
        flex: 1,

    },
    flashButton: {
        margin: 30,
        height:40,
        width:40,
        alignItems:'center',
        justifyContent:'center'
        
    },
    closeButton:{
        position:'absolute',
        top:30,
        right:30,
        height:40,
        width:40,
        backgroundColor:'transparent',
        alignItems:'center',
        justifyContent:'center'
    },
    snap:{
        position:'absolute',
        bottom:30,
        height:40,
        width,
        backgroundColor:'transparent',
        alignItems:'center',
        justifyContent:'center'
    }

});
