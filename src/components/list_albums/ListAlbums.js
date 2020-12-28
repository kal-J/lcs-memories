import { withRouter } from 'react-router-dom';
import './ListAlbums.scss';

const ListAlbums = (props) => {
  const { albums } = props;

  return (
    <>
      <section className="create_album">
        <button onClick={() => props.history.push('/create-album')}>
          CREATE ALBUM
        </button>
      </section>
      <section className="list_albums">
        {albums.map((album, index) => {
          return (
            <div
              key={index}
              className="album"
              onClick={() => {
                props.history.push({
                  pathname: '/',
                  state: {
                    search: album.name,
                  },
                });
              }}
            >
              <span>{album.name}</span>
            </div>
          );
        })}
      </section>
    </>
  );
};

export default withRouter(ListAlbums);
