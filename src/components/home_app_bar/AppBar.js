import { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import mapStateToProps from '../../redux/mapStateToProps';
import './style.scss';

const AppBar = (props) => {
  const [search, setSearch] = useState(props.search);
  const { photos } = props.redux_state;
  const { setPhotos } = props;

  const searchHandler = () => {
    if (search) {
      const matchedPhotos = photos.filter((photo) =>
        photo.album.includes(search)
      );
      return setPhotos(matchedPhotos);
    }
    return setPhotos(photos);
  };

  

  return (
    <div className="container_app_bar">
      <div className="search_input_wrapper">
        <form
          onSubmit={(e) => {
            e.preventDefault();

            searchHandler();
          }}
        >
          <input
            name="search"
            type="text"
            placeholder="SEARCH PHOTO ALBUMS"
            value={search || ''}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <button>SEARCH</button>
        </form>
      </div>

      <div className="botton_actions">
        <div className="filterby_date">
          <select name="filterby_date">
            <option value="null">-- FILTER BY DATE POSTED --</option>
            <option value="2 weeks">2 Weeks Ago</option>
            <option value="1 month">1 month Ago</option>
            <option value="6 months">6 months Ago</option>
            <option value="1 year">1 year Ago</option>
            <option value="2 years">2 years Ago</option>
          </select>
        </div>

        <div className="buttons">
          <span>
            <button onClick={() => props.history.push('/upload-photo')}>
              UPLOAD PHOTO
            </button>
          </span>
          <span>
            <button onClick={() => props.history.push('/create-album')}>
              CREATE ALBUM
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default withRouter(connect(mapStateToProps)(AppBar));
