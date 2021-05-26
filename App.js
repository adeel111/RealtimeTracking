import React, {useEffect} from 'react';
import {
  Text,
  View,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import {connect} from 'react-redux';
import {LogBox} from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Heartbeat from './src/Heartbeat';
import heart from './src/heart.png';
import {AskPermission} from './src/AskPermission';

// ignore warnings
LogBox.ignoreAllLogs();

const App = ({heartBeat, coordinates}) => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      getPermission();
    }
  });

  const getPermission = async () => {
    if (Platform.OS === 'android') {
      // check & ask for Location Permission
      const permission = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
      await AskPermission(permission);
      Heartbeat.startService();
      // Enable GPS
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      })
        .then(() => {})
        .catch(() => {});
    }
  };

  const imageSize = heartBeat ? 150 : 100;
  return (
    <View style={styles.container}>
      {/* <View style={styles.view}>
        <Image
          source={heart}
          style={{width: imageSize, height: imageSize}}
          resizeMode="contain"
        />
      </View> */}
      <View style={styles.view}>
        <Text style={styles.instructions}>Coordinates</Text>
        <Text />
        <Text style={styles.instructions}>
          {'Latitude:      ' + coordinates?.latitude}
        </Text>
        <Text style={styles.instructions}>
          {'Longitude:     ' + coordinates?.longitude}
        </Text>
        {/* <TouchableOpacity
          style={styles.button}
          onPress={() => Heartbeat.startService()}>
          <Text style={styles.instructions}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => Heartbeat.stopService()}>
          <Text style={styles.instructions}>Stop</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const mapStateToProps = store => ({
  heartBeat: store.AppReducer.heartBeat,
  coordinates: store.AppReducer.coords,
});

export default connect(mapStateToProps)(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  view: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'gray',
    padding: 10,
    margin: 10,
  },
  text: {
    fontSize: 20,
    color: 'white',
  },
});
