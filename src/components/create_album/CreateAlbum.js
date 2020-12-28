import { useState } from 'react';
import { connect } from 'react-redux';
import Firebase from '../../firebase';
import mapStateToProps from '../../redux/mapStateToProps';
import Error from '../Error';
import Loading from '../Loading';
import './CreateAlbum.scss';

const CreateAlbum = (props) => {
  const [album, setAlbum] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const { user } = props.redux_state;

  return (
    <>
      {loading && <Loading />}
      <section className="create_new_album">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!album || album === '') {
              setError('Name of album must not be empty');
              return;
            }

            setError(null);

            // submit album to firebase
            setLoading(true);

            Firebase.firestore()
              .collection('albums')
              .doc(album)
              .set({
                name: album,
                createdBy: user.uid,
              })
              .then(() => {
                setLoading(false);
                alert(`Success: ${album} Album has been Created.`);
                return props.history.push('/albums');
              })
              .catch((error) => {
                setLoading(false);
                setError(error.message);
              });
          }}
        >
          <div className="row">
            <label htmlFor="album_name">Give your new Album a name : </label>
            {error && <Error error={error} />}
            <input
              name="album_name"
              type="text"
              placeholder="ENTER YOUR NEW ALBUM NAME"
              value={album || ''}
              onChange={(e) => setAlbum(e.target.value)}
              style={error ? { borderColor: '#ff4500' } : {}}
            />
          </div>
          <div className="row">
            <button>SUBMIT</button>
          </div>
        </form>
      </section>
    </>
  );
};

export default connect(mapStateToProps)(CreateAlbum);
