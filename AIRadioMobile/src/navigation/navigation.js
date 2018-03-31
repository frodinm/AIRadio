import {TabNavigator,StackNavigator,DrawerNavigator} from 'react-navigation';
import {
    LoginScreen,
    CameraScreen
}from '../screens';

export const AppNavigator = new StackNavigator({
    app: {
        screen: LoginScreen
    },
    camera: {
        screen: CameraScreen,
        navigationOptions:{
           
        }
    },

});