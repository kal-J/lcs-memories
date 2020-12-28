import Loader from 'react-loader-spinner';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 20;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0, 0.8);
`;

const Loading = () => (
  <Container>
    <Loader type="ThreeDots" color="#ff4500" height={80} width={80} />
  </Container>
);

export default Loading;
