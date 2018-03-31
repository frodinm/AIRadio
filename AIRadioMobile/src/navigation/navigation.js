import React from 'react';
import {TabNavigator,StackNavigator,DrawerNavigator} from 'react-navigation';
import IconMaterial from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import FontIcon from 'react-native-vector-icons/dist/FontAwesome';
import {
    LoginScreen,
    CameraScreen,
    CameraRoll
}from '../screens';

export const AppNavigator = new TabNavigator({
    app: {
        screen: LoginScreen,
        navigationOptions:{
            tabBarLabel: 'Charts',
            tabBarIcon: ({ tintColor }) => {
                return  <FontIcon name="pie-chart" color={tintColor} size={25}/>;
                
            }
        }
    },
    camera: {
        screen: CameraScreen,
        navigationOptions:{
            header:null,
            tabBarLabel: 'Camera',
            tabBarIcon: ({ tintColor }) => {
                return  <FontIcon name="camera-retro" color={tintColor} size={25}/>;
                
            }
        },
    },
    cameraRoll: {
        screen: CameraRoll,
        navigationOptions:{
            header:null,
            tabBarLabel: 'Your pictures',
            tabBarIcon: ({ tintColor }) => {
                return  <FontIcon name="photo" color={tintColor} size={25}/>;
                
            }
        }
    },

},{
    tabBarOptions: {
        labelStyle: {
            fontSize: 12,
        },
        
  
    },
    tabBarPosition:'bottom'
});