import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableHighlight
} from "react-native";
import { AppNavigator } from "./src/navigation";

export default class App extends React.Component {
  render() {
    return <AppNavigator />;
  }
}
