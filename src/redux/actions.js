const setUser = (value) => ({
  type: 'SETUSER',
  payload: value,
});

const setLoading = (value) => ({
  type: 'SETLOADING',
  payload: value,
});

const setError = (value) => ({
  type: 'SETERROR',
  payload: value,
});

const setAlbums = (value) => ({
  type: 'SETALBUMS',
  payload: value,
});

const setPhotos = (value) => ({
  type: 'SETPHOTOS',
  payload: value,
});

export { setUser, setLoading, setError, setAlbums, setPhotos };
