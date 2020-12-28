import { withRouter } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import DownloadIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';
import { connect } from 'react-redux';
import mapStateToProps from '../../redux/mapStateToProps';
import Firebase from '../../firebase';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Loading from '../Loading';
import Modal from './Modal';
import './listPhotos.scss';
import Axios from 'axios';
import fileDownload from 'js-file-download';

const ListPhotos = (props) => {
  const [loading, setLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const { addPhotoButton, photos } = props;
  const { user } = props.redux_state;
  const { isAuthenticated } = user;

  const deletePhoto = (photo) => {
    setLoading(true);

    // delete photo from firestore
    Firebase.firestore()
      .collection('photos')
      .doc(photo.id)
      .delete()
      .then(() => {
        setLoading(false);

        const photoRef = Firebase.storage().ref().child(photo.path);

        // Delete the photo
        photoRef
          .delete()
          .then(() => {})
          .catch((error) => {});
      })
      .catch(() => {
        setLoading(false);
        alert('Error: Deleting Photo failure, try again');
      });
  };

  return (
    <>
      {loading && <Loading />}

      {addPhotoButton && (
        <section className="add_photo">
          <button onClick={() => props.history.push('/upload-photo')}>
            ADD NEW PHOTO
          </button>
        </section>
      )}
      <section className="photo_list">
        {selectedPhoto && (
          <Modal
            selectedPhoto={selectedPhoto}
            setSelectedPhoto={setSelectedPhoto}
          />
        )}
        <div className="row">
          {photos.length ? (
            photos.map((photo, index) => {
              if (!photo.path) {
                return '';
              }
              return (
                <motion.div
                  className="img-wrapper"
                  key={index}
                  layout
                  whileHover={{ opacity: 1 }}
                  s={true}
                >
                  <div className="img" onClick={() => setSelectedPhoto(photo)}>
                    <LazyLoad once={true} height={400}>
                      <motion.img
                        src={photo.url}
                        alt={`Uploaded by ${photo.uploadedBy}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                      />
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="actions"
                      >
                        <span
                          className="in-album"
                          onClick={(e) => e.stopPropagation()}
                        >
                          In {photo.album} Album
                        </span>
                        {isAuthenticated ? (
                          photo.uploadedBy === user.uid ? (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                deletePhoto(photo);
                              }}
                              title="Delete"
                            >
                              <DeleteIcon
                                onClick={(e) => e.stopPropagation()}
                                className="icon"
                              />
                            </span>
                          ) : (
                            ''
                          )
                        ) : (
                          ''
                        )}

                        <span
                          title="Download"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <DownloadIcon
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('\n\n Downloading file');

                              Axios.get(photo.url, {
                                responseType: 'blob',
                              })
                                .then((res) => {
                                  console.log('\n\n Downloading file');
                                  const splittedPath = photo.path.split('/');
                                  fileDownload(
                                    res.data,
                                    splittedPath[splittedPath.length - 1]
                                  );
                                })
                                .catch(() => {
                                  console.log('\n\n Downloading Error');
                                });
                            }}
                            className="icon"
                          />
                        </span>
                      </div>
                    </LazyLoad>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <p>Photos Not Available</p>
          )}
        </div>
      </section>
    </>
  );
};

export default withRouter(connect(mapStateToProps)(ListPhotos));
