import { combineReducers } from 'redux';

const INITIAL_STATE = {
  user: {},
  albums: [],
  photos: [],
};

const mainReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SETUSER': {
      const user = action.payload;

      const newState = {
        ...state,
        user: {
          get isAuthenticated() {
            if (user.uid) {
              return true;
            }
            return false;
          },
          ...user,
        },
      };
      return newState;
    }

    case 'SETLOADING': {
      const value = action.payload;

      const newState = {
        ...state,
        loading: value,
      };
      return newState;
    }

    case 'SETERROR': {
      const error = action.payload;

      const newState = {
        ...state,
        error: error,
      };
      return newState;
    }
    case 'SETALBUMS': {
      const albums = action.payload;

      const newState = {
        ...state,
        albums: albums,
      };

      localStorage.setItem('albums', JSON.stringify(albums));

      return newState;
    }

    case 'SETPHOTOS': {
      const photos = action.payload;

      const newState = {
        ...state,
        photos: photos,
      };

      localStorage.setItem('photos', JSON.stringify(photos));

      return newState;
    }

    default:
      return state;
  }
};

export default combineReducers({
  reducer: mainReducer,
});
