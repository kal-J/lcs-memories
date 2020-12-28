import { useState } from 'react';
import { connect } from 'react-redux';
import mapStateToProps from '../../redux/mapStateToProps';
import ListAlbums from '../list_albums/ListAlbums';
import ListPhotos from '../list_photos/ListPhotos';
import './account.scss';

const Account = (props) => {
  const [selected, setSelected] = useState('albums');

  const { photos, albums, user } = props.redux_state;
  const currentUserPhotos = photos.filter(
    (photo) => photo.uploadedBy === user.uid
  );
  const currentUserAlbums = albums.filter(
    (album) => album.createdBy === user.uid
  );

  return (
    <section className="account">
      <div className="row-account">
        <span
          style={
            selected === 'albums'
              ? {
                  color: '#fff',
                  backgroundColor: '#333',
                }
              : {}
          }
          onClick={() => setSelected('albums')}
        >
          MY ALBUMS
        </span>

        <span
          style={
            selected === 'photos'
              ? {
                  color: '#fff',
                  backgroundColor: '#333',
                }
              : {}
          }
          onClick={() => setSelected('photos')}
        >
          MY PHOTOS
        </span>
      </div>

      {selected === 'albums' ? (
        <section className="albums">
          {currentUserAlbums.length ? (
            <ListAlbums albums={currentUserAlbums} />
          ) : (
            <>
              <div className="row-btn">
                <button onClick={() => props.history.push('/create-album')}>
                  CREATE ALBUM
                </button>
              </div>

              <p>You have not created any album yet.</p>
            </>
          )}
        </section>
      ) : (
        <section className="photos">
          {currentUserPhotos.length ? (
            <ListPhotos addPhotoButton={true} photos={currentUserPhotos} />
          ) : (
            <>
              <div className="row-btn">
                <button onClick={() => props.history.push('/upload-photo')}>
                  ADD POTO
                </button>
              </div>
              <p>You have not uploaded any photos yet.</p>
            </>
          )}
        </section>
      )}
    </section>
  );
};

export default connect(mapStateToProps)(Account);
