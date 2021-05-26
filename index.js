import React, {useEffect} from 'react';
import {Platform, AppRegistry} from 'react-native';
import {Provider} from 'react-redux';
import RNLocation from 'react-native-location';
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
  // console.log('MyHeadlessTask');
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
              console.log(index);
              saveLocation(offlineLocs[index], 1);
            }
            store.dispatch(resetAction([]));
          } else {
            console.log('else part');
            saveLocation(position);
          }
        } else {
          const offlineLocs = store.getState().AppReducer.offlineCoords;
          console.log(offlineLocs.length);
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
  // var date = new Date().toLocaleString();
  // console.log(date);
  firestore()
    .collection('Location_data')
    .add({
      lat: type === 0 ? position.coords.latitude : position.latitude,
      lan: type === 0 ? position.coords.longitude : position.longitude,
    })
    .then(() => {
      console.log('Record added!');
    })
    .catch(() => {
      console.log('Record not added!');
    });
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
            console.log(locations[0]);
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
