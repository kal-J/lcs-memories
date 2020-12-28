import { useState } from 'react';
import { connect } from 'react-redux';
import mapStateToProps from '../../redux/mapStateToProps';
import styled from 'styled-components';
import './UploadPhoto.scss';
import Firebase from '../../firebase';
import byteSize from 'byte-size';
import { motion } from 'framer-motion';

const SelectAlbum = styled.section`
  display: flex;
  flex-direction: column;
  height: 80vh;
  width: 100%;
  justify-content: center;
  align-items: center;

  select {
    padding: 1em 2em;
    margin: 2em auto;
  }

  label {
    font-size: large;
    font-weight: bold;
  }
`;

const BtnContinue = styled.button`
  margin: 2em auto;
  color: #fff;
  background-color: #333;
  border: 0;
  padding: 1em 2em;
  font-weight: bolder;
  border-radius: 5px;
`;

const ProgressWrapper = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;

  p {
    display: hidden;
  }

  div {
    background-color: #03490c;
    height: 10px;
    border: 0;
    border-radius: 4px 4px 0 0;
  }
`;

const UploadPhoto = (props) => {
  const [file, setFile] = useState(null);
  const [album, setAlbum] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const { albums, user } = props.redux_state;

  console.log(file);
  console.log(albums);

  const uploadPhoto = () => {
    if (file && album) {
      const storageRef = Firebase.storage().ref();
      const uploadTask = storageRef.child(`${album}/${file.name}`).put(file);

      document.querySelector('#cancelButton').addEventListener('click', () => {
        uploadTask.cancel();
      });

      const uploadStatus = document.querySelector('.upload-status');
      if (uploadStatus) {
        uploadStatus.style.display = 'flex';
      }

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log('Upload is ' + progress + '% done');

          setProgress(progress);
          setUploading(true);
        },
        (error) => {
          // Handle unsuccessful uploads
          setFile(null);
          setUploading(false);
          alert('Error: File Upload Failed');
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            // console.log('File available at', downloadURL);
            Firebase.firestore()
              .collection('photos')
              .doc()
              .set({
                album: album,
                url: downloadURL,
                path: `${album}/${file.name}`,
                uploadedBy: user.uid,
                uploaded_at: Date.now(),
              })
              .then(() => {
                setUploading(false);
                setFile(null);
                setAlbum('');
                alert('Success: Photo upload complete.');
                return props.history.push('/');
              })
              .catch(() => {
                setUploading(false);
                setFile(null);
                alert('Error: something went wrong, try again.');
              });
          });
        }
      );
    }
  };

  if (!album) {
    return (
      <SelectAlbum>
        <label htmlFor="album">SELECT AN ALBUM TO UPLOAD A PHOTO TO:</label>
        <select name="album">
          <option value="Default">-- Use default album --</option>
          {albums.map((album, index) => {
            return (
              <option key={index} value={album.name}>
                {album.name}
              </option>
            );
          })}
        </select>

        <div className="btn">
          <BtnContinue
            onClick={() => {
              const album = document.querySelector('select[name="album"]')
                .value;
              setAlbum(album);
            }}
          >
            CONTINUE
          </BtnContinue>
        </div>
      </SelectAlbum>
    );
  }

  return (
    <section className="upload_photo">
      <ProgressWrapper>
        {uploading && <p className="upload-status">UPLOADING...</p>}

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: progress + '%' }}
          className="progress"
        ></motion.div>
      </ProgressWrapper>

      <div className="upload">
        {file ? (
          <div className="file-name">
            {file.name} <strong>(size: {`${byteSize(file.size)}`})</strong>
          </div>
        ) : (
          ''
        )}
        <input
          id="upload_photo"
          type="file"
          accept="image/*"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />
        <div>
          <button
            id="cancelButton"
            className="default"
            onClick={() => {
              setAlbum('');
              setFile(null);
              setUploading(false);
            }}
          >
            CANCEL
          </button>
          {file && !uploading ? (
            <button
              className="primary"
              onClick={() => {
                uploadPhoto();
              }}
            >
              UPLOAD PHOTO
            </button>
          ) : !uploading ? (
            <button
              className="primary"
              onClick={() => {
                document.querySelector('#upload_photo').click();
              }}
            >
              SELECT PHOTO
            </button>
          ) : (
            ''
          )}
        </div>
      </div>
    </section>
  );
};

export default connect(mapStateToProps)(UploadPhoto);
