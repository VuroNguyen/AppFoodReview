import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Button } from 'react-native-paper';

const FullMapScreen = ({region, onRegionChangeComplete, provider, onPress, ref}) => {
    return (
        <View style={styles.container}>
            <MapView
                provider={provider}
                style={styles.botMapBig}
                region={region}
                onRegionChangeComplete= {onRegionChangeComplete}
                ref = {ref}
            >
            </MapView>
            <View style={styles.markerWrap}>
                <Image style={styles.marker} source={require('../images/map_marker.png')}/>
            </View>
            <View style={{
                position:'absolute',
                top: '80%', //for center align
                left: '35%',
                }}>
                <Button color='black' style={{backgroundColor: 'white', height: 50, width:150, opacity: 0.5 }} onPress={onPress}>
                    Done
                    </Button>
            </View>
        </View>
    )
}

export default FullMapScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    botMapBig: {
        flex:1,
        padding:0,
      },
      markerWrap: {
        top: '50%',
        left:'50%',
        marginLeft: -24,
        marginTop: -48,
        position:'absolute',
      },
      marker: {
        width: 30,
        height: 30,
      },
});

