import {createStore, combineReducers} from 'redux';
import {createAction, handleActions} from 'redux-actions';

const appInitialState = {
  heartBeat: false,
  offlineCoords: [],
};

const RESET_ACTION = 'RESET_ACTION';
const SET_HEART_BEAT = 'SET_HEART_BEAT';
const SET_CURRENT_COORDS = 'SET_CURRENT_COORDS';
const SAVE_OFFLINE_COORDS = 'SAVE_OFFLINE_COORDS';

export const resetAction = createAction(RESET_ACTION);
export const setHeartBeat = createAction(SET_HEART_BEAT);
export const setCurrentCoords = createAction(SET_CURRENT_COORDS);
export const setOfflineCoords = createAction(SAVE_OFFLINE_COORDS);

const AppReducer = handleActions(
  {
    [RESET_ACTION]: (state, {payload}) => ({
      ...state,
      offlineCoords: payload,
    }),
    [SET_HEART_BEAT]: (state, {payload}) => ({
      ...state,
      heartBeat: payload,
    }),
    [SET_CURRENT_COORDS]: (state, {payload}) => ({
      ...state,
      coords: payload,
    }),
    [SAVE_OFFLINE_COORDS]: (state, {payload}) => ({
      ...state,
      offlineCoords: [...state.offlineCoords, payload],
    }),
  },
  appInitialState,
);

const rootReducer = combineReducers({
  AppReducer,
});

const configureStore = () => createStore(rootReducer);

export const store = configureStore();
