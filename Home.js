import React from 'react';
import {StyleSheet, Button, Image, Text, View} from 'react-native';

const HomeScreen = ({navigation}) => {
  return (
    <View style={{flexDirection: 'column', flex: 1}}>
      <View style={styles.lastGeneration}>
        {/* This view holds the information about the last generation
            added by the user
             */}
        <Text style={styles.primaryText}>
          Take a look at your last addition:
        </Text>
        <Image
          style={styles.tempImg}
          source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}}
        />
        <Text style={styles.secondaryText}>Location: Hackney</Text>
        <Text style={styles.secondaryText}>Time: Monday</Text>
      </View>
      <View style={styles.navigationSpace}>
        {/* This view is the navigation space  */}
        <Button
          onPress={() => navigation.navigate('History')}
          title="See History"
        />
        <Button onPress={() => navigation.navigate('Add')} title="Add new" />
        <Button onPress={() => navigation.navigate('Map')} title="Map" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  lastGeneration: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
  navigationSpace: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 20,
    justifyContent: 'space-evenly',
  },
  primaryText: {
    color: 'white',
    margin: 10,
    fontSize: 20,
  },
  secondaryText: {
    color: 'white',
    margin: 10,
    fontSize: 15,
  },
  tempImg: {
    width: 200,
    height: 200,
    marginTop: 10,
    margin: 20,
  },
});

export default HomeScreen;
