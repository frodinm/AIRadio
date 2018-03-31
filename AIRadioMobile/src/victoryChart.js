import React from 'react';
import { StyleSheet, View } from 'react-native';
import { VictoryPie, VictoryChart, VictoryTheme } from 'victory-native';

export default class VChart extends React.Component {
    state = {
        data: [
            { x: 1, y: 2, label: 'joy' },
            { x: 2, y: 3, label: 'fear' },
            { x: 3, y: 5, label: 'sadness' },
            { x: 4, y: 2, label: 'surprise' },
            { x: 5, y: 3, label: 'anger' }
        ]
    };
    render() {
        return (
            <View style={styles.container}>
                <VictoryPie
                    colorScale={['tomato', 'orange', 'gold', 'cyan', 'navy']}
                    data={this.state.data}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5fcff'
    }
});
