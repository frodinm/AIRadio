export const appConnection= (socket) => ({
    personnality: (text)=>{
        console.log(socket);
        socket.emit('text', text);
       
    },
    image: (image)=>{   
        socket.emit('image', image);
    }
});