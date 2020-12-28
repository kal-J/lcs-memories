import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  p {
    color: #db5a6b;
    margin: 0.5em;
    font-size: small;
  }
`;

const Error = ({ error }) => <Container>{error && <p>{error}</p>}</Container>;

export default Error;
