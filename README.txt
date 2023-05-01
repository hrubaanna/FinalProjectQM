This README file is intended to provide an overview on how to setup your local environment to run the application.

Prerequisites: 
- Node.js > 12 
- npm
- Watchman
- XCode 12
- Cocoapods

Dependencies (should be installed by npm):
- @react-navigation/native: ^6.1.6
- @react-navigation/native-stack": ^6.9.12,
- axios: ^1.3.5,
- bcryptjs: ^2.4.3
- color: ^4.2.3
- cors: ^2.8.5
- express: ^4.18.2
- geolib: ^3.3.3
- immer: ^9.0.21
- jsonwebtoken: ^9.0.0
- mongoose: ^7.0.3
- react: 18.2.0
- react-native: 0.71.4
- react-native-fs: ^2.20.0
- react-native-geocoding: ^0.5.0
- react-native-get-location: ^3.0.1
- react-native-image-colors: ^1.5.2
- react-native-image-picker: ^5.3.1
- react-native-safe-area-context: ^4.5.0
- react-native-screens: ^3.20.0

Running the project:
1. navigate to the root folder and run: npm install
2. run: cd ios && pod install && cd ..
3. run: npx react-native start
4. press 'i' to launch ios simulation