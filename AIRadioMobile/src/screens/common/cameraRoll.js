import React from 'react';
import { StyleSheet, Text, View, TextInput,Dimensions, TouchableHighlight, CameraRoll,Modal,Button,Image,ScrollView,TouchableOpacity,StatusBar,FlatList } from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import IOSicon from 'react-native-vector-icons/dist/Ionicons';
import MaterialIcon from 'react-native-vector-icons/dist/MaterialIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import flashon from '../../assets/camera/ic_flash_on_white.png';
import flashoff from '../../assets/camera/ic_flash_off_white.png';
import CameraCapture from 'react-native-camera';
import {appConnection,Context} from '../../util';


const {height,width} = Dimensions.get('window');

class Roll extends React.Component {
    constructor(){
        super();
        this.state={
            images: [],
            refreshing: false
        };

    }
    componentDidMount(){
        CameraRoll.getPhotos({first:100}).then(r => this.setState({images:r.edges}));
    }


    handleSendImage(image){
        RNFetchBlob.fs.readFile(image, 'base64')
            .then((data) => {
                console.log(data);
                appConnection(this.props.socket).image(data);
            });
        this.props.navigation.navigate('app');
        
    }

    _keyExtractor = (item, index) => item.node.image.uri;

    _renderItem = ({item}) => (
        <TouchableHighlight
            underlayColor='transparent'
            onPress={() => this.handleSendImage(item.node.image.uri)}
        >
            <Image
                style={{
                    width: width/3,
                    height: width/3
                }}
                source={{uri: item.node.image.uri}}
            />
        </TouchableHighlight>
    );


    
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    contentContainerStyle={styles.scrollView}
                    data={this.state.images}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    numColumns={3}
                    refreshing={this.state.refreshing}
                    onRefresh={()=>CameraRoll.getPhotos({first:100}).then(r => this.setState({images:r.edges}))}>
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
                </FlatList>
            </View>
        );
    }
}

export default class CameraRollData extends React.Component{
    render(){
        const {props} = this;
        return(
            <Context.Consumer>
                {value=> <Roll {...props} socket={value}/>}
            </Context.Consumer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollView: {
      
    },
    shareButton: {
        position: 'absolute',
        width,
        padding: 10,
        bottom: 0,
        left: 0
    }

});
