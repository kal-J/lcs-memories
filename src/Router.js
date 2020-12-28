import { Route, withRouter } from 'react-router-dom';
import AboutUs from './components/about/AboutUs';
import Account from './components/account/Account';
import Signin from './components/auth/Signin';
import Signup from './components/auth/Signup';
import CreateAlbum from './components/create_album/CreateAlbum';
import Home from './components/Home';
import ListAlbums from './components/list_albums/ListAlbums';
import UploadPhoto from './components/upload_photo/UploadPhoto';
import { connect } from 'react-redux';
import mapStateToProps from './redux/mapStateToProps';

const Router = (props) => {
  const { user, albums } = props.redux_state;

  return (
    <>
      <Route
        exact
        path="/"
        render={(props) => {
          return <Home photos={props.photos} {...props} />;
        }}
      />
      <Route
        exact
        path="/account"
        render={() => {
          if (!user.isAuthenticated) {
            return props.history.push('/signin');
          }
          return <Account {...props} />;
        }}
      />

      <Route
        exact
        path="/albums"
        render={() => {
          return (
            <section
              style={{
                marginTop: '4em',
              }}
            >
              <ListAlbums albums={albums} {...props} />
            </section>
          );
        }}
      />

      <Route
        exact
        path="/about-us"
        render={() => {
          return <AboutUs {...props} />;
        }}
      />

      <Route
        exact
        path="/upload-photo"
        render={() => {
          if (!user.isAuthenticated) {
            return props.history.push('/signin');
          }
          return <UploadPhoto {...props} />;
        }}
      />

      <Route
        exact
        path="/create-album"
        render={() => {
          if (!user.isAuthenticated) {
            return props.history.push('/signin');
          }
          return <CreateAlbum {...props} />;
        }}
      />
      <Route
        exact
        path="/signin"
        render={() => {
          if (user.isAuthenticated) {
            return props.history.push('/');
          }
          return <Signin {...props} />;
        }}
      />
      <Route
        exact
        path="/signup"
        render={() => {
          if (user.isAuthenticated) {
            return props.history.push('/');
          }
          return <Signup {...props} />;
        }}
      />
    </>
  );
};

export default connect(mapStateToProps)(withRouter(Router));
