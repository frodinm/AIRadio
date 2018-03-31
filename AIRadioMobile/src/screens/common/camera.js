import React from 'react';
import { StyleSheet, Text, View, TextInput,Dimensions, TouchableHighlight, CameraRoll,Modal,Button,Image,ScrollView,TouchableOpacity } from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import { RNCamera } from 'react-native-camera';
import {appConnection} from '../../util';


const {height,width} = Dimensions.get('window');


export default class Camera extends React.Component {
    constructor(){
        super();
        this.state={
            
        };
    }
    
    render() {
        return (
            <View style={styles.container}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.off}
                    permissionDialogTitle={'Permission to use camera'}
                    permissionDialogMessage={'We need your permission to use your camera phone'}

                />
                <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center',}}>
                    <TouchableOpacity
                        onPress={this.takePicture.bind(this)}
                        style = {styles.capture}
                    >
                        <Text style={{fontSize: 14}}> SNAP </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    takePicture = async function() {
        if (this.camera) {
            const options = { quality: 0.5, base64: true };
            const data = await this.camera.takePictureAsync(options);
        
            CameraRoll.saveToCameraRoll(data.uri.toString(),'photo');
            RNFetchBlob.fs.readFile(data.uri, 'base64')
                .then((data) => {
                    console.log(this.props.navigation.state.socket);
                    console.log(data);
                    appConnection(this.props.navigation.state.socket).image(data);
                });
            alert(data.uri);
        }
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20
    }
});

