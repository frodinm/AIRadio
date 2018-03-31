import {TabNavigator,StackNavigator,DrawerNavigator} from 'react-navigation';
import {
    LoginScreen,
    CameraScreen,
    CameraRoll
}from '../screens';

export const AppNavigator = new TabNavigator({
    app: {
        screen: LoginScreen
    },
    camera: {
        screen: CameraScreen,
        navigationOptions:{
            header:null
        }
    },
    cameraRoll: {
        screen: CameraRoll,
        navigationOptions:{
            header:null
        }
    },

},{
    tabBarPosition:'bottom'
});