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

  useEffect(() => {
    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser({ ...user });
      }
    });
    // clean up function
    // eslint-disable-next-line
  }, []);

  // fetch photos on initial mount
  useEffect(() => {
    let photos = [];
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
        setLoading(false);
      });

    //return () => unsub();

    //eslint-disable-next-line
  }, []);

  // fetch albums on initial mount
  useEffect(() => {
    let albums = [];

    Firebase.firestore()
      .collection('albums')
      .get()
      .then((snapShot) => {
        snapShot.docs.forEach((doc) => {
          albums.push({ id: doc.id, ...doc.data() });
        });

        setAlbums(albums);
      })
      .catch(() => {});

    //return () => unsub();

    //eslint-disable-next-line
  }, []);

  useEffect(() => {
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
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
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

    // eslint-disable-next-line
  }, []);

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
