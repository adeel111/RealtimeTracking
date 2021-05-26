import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Platform,
  SafeAreaView,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {AskPermission} from './src/AskPermission';

const App = () => {
  const [lat, setLat] = useState('');
  const [lan, setLan] = useState('');

  useEffect(() => {
    getPermission();
  });

  const getPermission = async () => {
    if (Platform.OS === 'android') {
      // check & ask for Location Permission
      const permission = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
      await AskPermission(permission);
      // Enable GPS
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      });
      setTimeout(() => {
        getCurrentLocation();
      }, 1000);
    } else {
      setTimeout(() => {
        getCurrentLocation();
      }, 1000);
    }
  };

  const getCurrentLocation = () => {
    console.log('Into method');
    // Geolocation.requestAuthorization();
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        setLat(position.coords.latitude);
        setLan(position.coords.longitude);
      },
      error => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  };

  return (
    <SafeAreaView
      style={{flex: 0.5, alignItems: 'center', justifyContent: 'center'}}>
      <Text> Lat: {lat} </Text>
      <Text> </Text>
      <Text> Lan: {lan} </Text>
    </SafeAreaView>
  );
};

export default App;
