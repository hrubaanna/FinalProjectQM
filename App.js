import React from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './Home';
import HistoryScreen from './History';
import AddScreen from './Add';
import MapScreen from './Map';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Welcome Anna'}}
        />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Add" component={AddScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    // <View
    //   style={{
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //   }}>
    //   <Text>Hello World</Text>
    // </View>
  );
};

export default App;
