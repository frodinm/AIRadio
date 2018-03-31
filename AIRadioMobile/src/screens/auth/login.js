import React from 'react';
import { StyleSheet, Text, View, TextInput,Dimensions, TouchableHighlight, CameraRoll,Modal,Button,Image,ScrollView } from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import SocketIOClient from 'socket.io-client';
import {appConnection} from '../../util';

const {height,width} = Dimensions.get('window');


export default class Login extends React.Component {
    constructor(){
        super();
        this.state={
            text: '',
            modalVisible: false,
            images: []
        };
        this.socket =  SocketIOClient('https://40e1665d.ngrok.io');
        
    }
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    handlePersonnality(text){
        appConnection(this.socket).personnality(text);
    }
    handleSendImage(image){
        RNFetchBlob.fs.readFile(image, 'base64')
            .then((data) => {
                console.log(data);
                appConnection(this.socket).image(data);
            });
        this.setState({
            modalVisible: false
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <Text>AIRadio</Text>
                <TextInput placeholder="test" style={styles.textInput} onChangeText={(text)=>this.setState({text})}/>
                <TouchableHighlight onPress={()=>this.handlePersonnality(this.state.text)}>
                    <Text>Submit</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={()=>CameraRoll.getPhotos({
                    first: 20,
                    assetType: 'All'
                }).then(r => console.log(r))}>
                    <Text>Camera Roll</Text>
                </TouchableHighlight>
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => console.log('closed')}
                >
                    <View style={styles.modalContainer}>
                        <Button
                            title='Close'
                            onPress={()=>this.setModalVisible(false)}
                        />
                        <ScrollView
                            contentContainerStyle={styles.scrollView}>
                            {
                                this.state.images.map((p, i) => {
                                    return (
                                        <TouchableHighlight
                                            style={{opacity: i === this.state.index ? 0.5 : 1}}
                                            key={i}
                                            underlayColor='transparent'
                                            onPress={() => this.handleSendImage(p.node.image.uri)}
                                        >
                                            <Image
                                                style={{
                                                    width: width/3,
                                                    height: width/3
                                                }}
                                                source={{uri: p.node.image.uri}}
                                            />
                                        </TouchableHighlight>
                                    );
                                })
                            }
                        </ScrollView>
                        
                    </View>
                </Modal>

                <TouchableHighlight
                    onPress={() => {
                        CameraRoll.getPhotos({
                            first: 20,
                            assetType: 'All'
                        }).then(r => this.setState({
                            images: r.edges,
                            modalVisible: true
                        }));
                        
                    }}>
                    <Text>Show Modal</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={() => this.props.navigation.navigate('camera',{socket:this.socket})}>
                    <Text>Show Camera</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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
