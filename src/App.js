import { useEffect, useState } from 'react';
import { Provider, connect } from 'react-redux';
import mapStateToProps from './redux/mapStateToProps';
import { setAlbums, setUser, setPhotos } from './redux/actions';
import { store } from './redux/store';
import Router from './Router';
import Nav from './components/nav/Index';
import Firebase from './firebase';
import Loading from './components/Loading';
import { withRouter } from 'react-router-dom';
import Footer from './components/footer/Footer';
import './App.scss';

const App = (props) => {
  const { setUser, setAlbums, setPhotos } = props;
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnectionChange = () => {
    const condition = navigator.onLine ? 'online' : 'offline';
    if (condition === 'online') {
      const webPing = setInterval(() => {
        fetch('//google.com', {
          mode: 'no-cors',
        })
          .then(() => {
            setIsConnected(true);
            return clearInterval(webPing);
          })
          .catch(() => {
            setIsConnected(false);
            return clearInterval(webPing);
          });
      }, 2000);
      return;
    }

    return setIsConnected(false);
  };

  const componentDidMount = () => {
    handleConnectionChange();
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);
  };

  const componentWillUnmount = () => {
    window.removeEventListener('online', handleConnectionChange);
    window.removeEventListener('offline', handleConnectionChange);
  };

  useEffect(() => {
    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser({ ...user });
      }
    });
    // clean up function
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    componentDidMount();

    return () => componentWillUnmount();
    // eslint-disable-next-line
  }, []);

  // fetch photos on initial mount
  useEffect(() => {
    let photos = [];
    if (isConnected) {
      Firebase.firestore()
        .collection('photos')
        .orderBy('uploaded_at', 'desc')
        .get()
        .then((snapShot) => {
          snapShot.docs.forEach((doc) => {
            photos.push({ id: doc.id, ...doc.data() });
          });

          setPhotos(photos);

          setLoading(false);
        })
        .catch(() => {
          console.log('FETCHING LOCAL PHOTOS');

          const local_photos = localStorage.getItem('photos');
          local_photos ? setPhotos(JSON.parse(local_photos)) : setPhotos([]);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    //return () => unsub();

    //eslint-disable-next-line
  }, [isConnected]);

  // fetch albums on initial mount
  useEffect(() => {
    let albums = [];

    if (isConnected) {
      Firebase.firestore()
        .collection('albums')
        .get()
        .then((snapShot) => {
          snapShot.docs.forEach((doc) => {
            albums.push({ id: doc.id, ...doc.data() });
          });

          setAlbums(albums);
        })
        .catch(() => {
          console.log('FETCHING LOCAL PHOTOS');

          const local_albums = localStorage.getItem('albums');
          local_albums ? setAlbums(JSON.parse(local_albums)) : setAlbums([]);
        });
    }

    //return () => unsub();

    //eslint-disable-next-line
  }, [isConnected]);

  useEffect(() => {
    if (isConnected) {
      Firebase.firestore()
        .collection('albums')
        .onSnapshot((querySnapshot) => {
          let albums = [];
          if (!querySnapshot.empty) {
            const albums_snapshot = querySnapshot.docs;
            albums_snapshot.forEach((doc) => {
              albums.push(doc.data());
            });
          }
          setAlbums(albums);
        });
    }
    // eslint-disable-next-line
  }, [isConnected]);

  useEffect(() => {
    if (isConnected) {
      Firebase.firestore()
        .collection('photos')
        .orderBy('uploaded_at', 'desc')
        .onSnapshot((querySnapshot) => {
          let photos = [];
          if (!querySnapshot.empty) {
            const photos_snapshot = querySnapshot.docs;
            photos_snapshot.forEach((doc) => {
              photos.push({ id: doc.id, ...doc.data() });
            });
          }
          setPhotos(photos);
        });
    }

    // eslint-disable-next-line
  }, [isConnected]);

  return (
    <div className="App">
      <Nav />
      {loading ? <Loading /> : <Router {...props} />}
      <Footer />
    </div>
  );
};

const AppContainer = () => {
  const AppComponent = connect(mapStateToProps, {
    setUser,
    setAlbums,
    setPhotos,
  })(withRouter(App));
  return (
    <Provider store={store}>
      <AppComponent />
    </Provider>
  );
};

export default AppContainer;
