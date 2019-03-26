import io from 'socket.io-client';

export default io(process.env.SOCKET_IO_URL); // <-- use your socket server here and configuration
