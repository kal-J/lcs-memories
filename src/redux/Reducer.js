import { combineReducers } from 'redux';

const getLocalAlbums = () => {
  let local_albums = localStorage.getItem('albums');
  if (local_albums) {
    return JSON.parse(local_albums);
  }
  return local_albums;
};
const getLocalPhotos = () => {
  let local_photos = localStorage.getItem('photos');
  if (local_photos) {
    return JSON.parse(local_photos);
  }
  return local_photos;
};

const setLocalPhotos = (photos) => {
  localStorage.setItem('photos', JSON.stringify(photos));

  return;
};
const setLocalAlbums = (albums) => {
  localStorage.setItem('albums', JSON.stringify(albums));

  return;
};

const INITIAL_STATE = {
  user: {},
  albums: getLocalAlbums() || [],
  photos: getLocalPhotos() || [],
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
      
      setLocalAlbums(albums);

      return newState;
    }

    case 'SETPHOTOS': {
      const photos = action.payload;

      const newState = {
        ...state,
        photos: photos,
      };

      setLocalPhotos(photos);

      return newState;
    }

    default:
      return state;
  }
};

export default combineReducers({
  reducer: mainReducer,
});
