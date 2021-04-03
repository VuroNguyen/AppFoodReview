import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import {dataTest} from '../models/data';
import Card from '../components/Card';

const Popular = () => {
    const renderItem = ({item}) => {
        return (
            <Card 
                itemData={item}
                onPress={()=> {}}
            />
        );
    };

    return (
      <View style={styles.container}>
        <FlatList 
            data={dataTest}
            renderItem={renderItem}
            keyExtractor={item => item.id}
        />
      </View>
    );
};


export default Popular;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      width: '90%',
      alignSelf: 'center'
    },
  });