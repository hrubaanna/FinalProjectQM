import React, {useRef} from 'react';
import {Animated, StyleSheet, Text, View, Button, FlatList} from 'react-native';

const GenerationItem = props => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  return (
    <View>
      <Text style={styles.generationItem}>
        {props.location} on {props.time}
      </Text>
    </View>
  );
};

const HistoryScreen = ({navigation}) => {
  return (
    <View style={{flex: 1, flexDirection: 'column'}}>
      <View style={styles.generationsList}>
        {/* All previous additions */}
        <FlatList
          data={[
            {location: 'Hackney', time: 'Monday'},
            {location: 'Camden', time: 'Friday'},
            {location: 'Kensington', time: 'Thursday'},
            {location: 'Islington', time: 'Monday'},
            {location: 'Hackney', time: 'Tuesday'},
            {location: 'Chelsea', time: 'Wednesday'},
            {location: 'Hackney', time: 'Saturday'},
            {location: 'Camden', time: 'Saturday'},
            {location: 'Fulham', time: 'Sunday'},
            {location: 'Hackney', time: 'Monday'},
            {location: 'Kensington', time: 'Wednesday'},
            {location: 'Hackney', time: 'Monday'},
            {location: 'Fulham', time: 'Thursday'},
            {location: 'Islington', time: 'Friday'},
            {location: 'Westminster', time: 'Saturday'},
          ]}
          renderItem={({item}) => (
            <GenerationItem location={item.location} time={item.time} />
          )}
        />
      </View>

      <View style={styles.navigationSpace}>
        {/* Navigation space */}
        <Button
          onPress={() => navigation.navigate('Home')}
          title="Go to Home Screen"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  generationsList: {
    flex: 6,
    backgroundColor: 'timberbrown',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  generationItem: {
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    //span the whole width of the screen
    width: 300,
  },
  navigationSpace: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 20,
  },
});

export default HistoryScreen;
