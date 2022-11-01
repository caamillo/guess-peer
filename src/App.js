import { useEffect } from 'react';
import socketIO from 'socket.io-client';
const socket = socketIO.connect('http://localhost:5001');

function App() {

  useEffect(() => {

    return () => {
    }
  }, [])

  return (
    <div>
      <button onClick={ () => {
      } }>Create Room</button>
    </div>
  );
}

export default App