import React from 'react';
import GetLocation from 'react-native-get-location';
import {launchCamera} from 'react-native-image-picker';
import {Button, Image, StyleSheet, Text, TextInput, View} from 'react-native';

const AddScreen = ({navigation}) => {
  const [text, onChangeText] = React.useState('Description');
  const [imgPath, setImgPath] = React.useState(null);
  const [imgData, setImgData] = React.useState(null);
  const [imgUri, setImgUri] = React.useState(null);

  handleGetLocation = () => {
    // Get current location of the device
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        console.log('_______________________');
        console.log(location);
        console.log('_______________________');
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });
  };

  handleImage = () => {
    // Open camera
    var options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchCamera(options, response => {
      console.log('_______________________');
      console.log('response', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        //let source = {uri: response.uri};
        console.log('response', JSON.stringify(response));
        setImgPath(response);
        setImgData(response.data);
        setImgUri(response.uri);
      }
      console.log('_______________________');
    });
  };

  return (
    <View>
      <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 24}}>Create a new generation</Text>
      </View>
      <Button title="Get location" onPress={this.handleGetLocation} />
      <Button title="Take a picture" onPress={this.handleImage} />
      {/* Once location and picture are taken,
      propose a CA design and ask user if they want a custom */}
      {/* <Button title="Design CA" /> */}
      <TextInput
        onChangeText={onChangeText}
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        placeholder="Enter description"
        value={text}
      />
      <Button title="Submit" />
    </View>
  );
};

export default AddScreen;
