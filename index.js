import React, {useEffect} from 'react';
import {Platform, AppRegistry} from 'react-native';
import moment from 'moment';
import {Provider} from 'react-redux';
import RNLocation from 'react-native-location';
import {getDeviceId} from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import firestore from '@react-native-firebase/firestore';
import Geolocation from 'react-native-geolocation-service';
import App from './App';
import {name as appName} from './app.json';
import {
  store,
  resetAction,
  setHeartBeat,
  setCurrentCoords,
  setOfflineCoords,
} from './src/store';

let count = 0;
let getLoc = 0;

const MyHeadlessTask = async () => {
  // store.dispatch(setHeartBeat(true));
  // setTimeout(() => {
  //   store.dispatch(setHeartBeat(false));
  // }, 1000);
  if (getLoc === 0) {
    getLoc++;
    getCurrentLocation();
  }

  count++;
  if (count % 400 === 0) {
    getCurrentLocation();
    count = 1;
  }
};

const getCurrentLocation = () => {
  Geolocation.getCurrentPosition(
    position => {
      store.dispatch(setCurrentCoords(position.coords));
      // check internet connectivity
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          const offlineLocs = store.getState().AppReducer.offlineCoords;
          if (offlineLocs.length > 0) {
            for (let index = 0; index < offlineLocs?.length; index++) {
              saveLocation(offlineLocs[index], 1);
            }
            store.dispatch(resetAction([]));
          } else {
            saveLocation(position);
          }
        } else {
          store.dispatch(setOfflineCoords(position.coords));
        }
      });
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

const saveLocation = (position, type = 0) => {
  var datetime = new Date().toLocaleString();
  var date = moment(datetime).format('LL');
  var time = moment(datetime).format('LT');

  const lat = type === 0 ? position.coords.latitude : position.latitude;
  const lan = type === 0 ? position.coords.longitude : position.longitude;
  fetch(
    'https://maps.googleapis.com/maps/api/geocode/json?address=' +
      lat +
      ',' +
      lan +
      '&key=' +
      'AIzaSyDDIS077iHUpAMUo_awtMtmxFJve37sSWg',
  )
    .then(response => response.json())
    .then(responseJson => {
      const userLocation = responseJson.results[0].formatted_address;
      firestore()
        .collection('Location_Data')
        .doc(getDeviceId())
        .collection(date.toString())
        .doc(time.toString())
        .set({latitude: lat, longitude: lan, address: userLocation})
        .then(() => {
          console.log('Record added!');
        })
        .catch(() => {
          console.log('Record not added!');
        });
    });
  return;
};

const RNRedux = () => {
  useEffect(() => {
    if (Platform.OS === 'ios') {
      RNLocation.configure({
        distanceFilter: 5.0,
      });
      RNLocation.requestPermission({
        ios: 'always', // or 'whenInUse'
        android: {
          detail: 'fine', // 'coarse'
        },
      }).then(granted => {
        if (granted) {
          RNLocation.subscribeToLocationUpdates(locations => {
            store.dispatch(setCurrentCoords(locations[0]));
            saveLocation(locations[0], 1);
          });
        }
      });
    }
  });

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};
  
AppRegistry.registerHeadlessTask('Heartbeat', () => MyHeadlessTask);
AppRegistry.registerComponent(appName, () => RNRedux);
