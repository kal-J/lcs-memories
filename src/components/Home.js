import { connect } from 'react-redux';
import mapStateToProps from '../redux/mapStateToProps';
import { useEffect, useState } from 'react';
import AppBar from './home_app_bar/AppBar';
import ListPhotos from './list_photos/ListPhotos';

const Home = (props) => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const { photos } = props.redux_state;
    setPhotos(photos);
  }, [props.redux_state]);

  let search = null;
  if (props.location) {
    if (props.location.state) {
      search = props.location.state.search;
    }
  }

  return (
    <div className="App">
      <AppBar search={search} setPhotos={setPhotos} />
      <ListPhotos photos={photos} />
    </div>
  );
};

export default connect(mapStateToProps)(Home);
