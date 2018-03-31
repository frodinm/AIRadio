import React from 'react';
import { StyleSheet, Text, View, TextInput,Dimensions, TouchableHighlight } from 'react-native';
import {AppNavigator} from './src/navigation';
import SocketIOClient from 'socket.io-client';
import {Context} from './src/util';

class Provider extends React.Component {
    constructor(){
        super();
        this.state={
            socket :  SocketIOClient('https://867766a1.ngrok.io')
        };
    }
    render(){
        return(
            <Context.Provider value={this.state.socket}>
                {this.props.children}
            </Context.Provider>
        );
    }
}


export default class App extends React.Component {

    render() {
        return (
            <Provider>
                <AppNavigator/>
            </Provider>
        );
    }
}


