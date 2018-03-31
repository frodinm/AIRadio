import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SocketIOClient from "socket.io-client";

export default class App extends React.Component {
  constructor() {
    super();
    // Creating the socket-client instance will automatically connect to the server.
    this.socket = SocketIOClient("https://9c1fa3c7.ngrok.io");
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
