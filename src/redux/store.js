import { createStore } from 'redux';
import reducer from './Reducer';

const loadState = (key) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

/* const saveState = (key, value) => {
  try {
    const serializedState = JSON.stringify(value);
    localStorage.setItem(key, serializedState);
  } catch {
    // ignore write errors
  }
}; */

const local_photos = loadState('photos');
const local_albums = loadState('albums');

const store = createStore(reducer, {
  reducer: { photos: local_photos, albums: local_albums, user: {} },
});


export { store };
