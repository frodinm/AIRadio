import {TabNavigator,StackNavigator,DrawerNavigator} from 'react-navigation';
import {
    LoginScreen,
    CameraScreen,
    CameraRoll
}from '../screens';

export const AppNavigator = new TabNavigator({
    app: {
        screen: LoginScreen,
        navigationOptions:{
            tabBarLabel: 'Charts'
        }
    },
    camera: {
        screen: CameraScreen,
        navigationOptions:{
            header:null,
            tabBarLabel: 'Camera'
        }
    },
    cameraRoll: {
        screen: CameraRoll,
        navigationOptions:{
            header:null,
            tabBarLabel: 'Your pictures'
        }
    },

},{
    tabBarPosition:'bottom'
});