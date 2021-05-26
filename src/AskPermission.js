import React from 'react';
import {PermissionsAndroid} from 'react-native';

export const AskPermission = async permission => {
  try {
    const granted = await PermissionsAndroid.request(permission);
    if (granted === true || granted === PermissionsAndroid.RESULTS.GRANTED) {
      // console.warn("Permission Granted");
    } else {
      // console.warn("Permission Denied");
    }
  } catch (err) {
    console.warn(err);
  }
};
