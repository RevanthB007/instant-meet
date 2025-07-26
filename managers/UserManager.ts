import { Socket } from "socket.io";
import { RoomManager } from "./RoomManager";
export interface User {
    socket: Socket,
    name: String
}

export class UserManager {
    private users: User[];
    private queue: string[];
    private roomManager: RoomManager

    constructor() {
        this.users = [];
        this.queue = [];
        this.roomManager = new RoomManager();
    }

    addUser(name: string, socket: Socket) {
        this.users.push({ name: name, socket: socket });
        this.queue.push(socket.id);
        socket.send("lobby")
        this.clearQueue();
        this.initHandlers(socket);
    }

    removeUser(socketId: string) {
        const user = this.users.find(user => user.socket.id === socketId);
        if(!user){
            return;
        }
        this.users = this.users.filter(user => user.socket.id !== socketId);
        this.queue = this.queue.filter(id => id !== socketId);
    }

    clearQueue() {
        if (this.queue.length < 2) {
            console.log("not enough users");
            return;
        }
        const id1 =this.queue.pop();
        const id2 =this.queue.pop();
        const user1 = this.users.find(user => user.socket.id === id1);
        const user2 = this.users.find(user => user.socket.id === id2);

        if (!user1 || !user2) {
            return;
        }

        console.log("create room", user1.socket.id, user2.socket.id);

        this.roomManager.createRoom(user1, user2);

    }

    initHandlers(socket: Socket) {
        socket.on("offer", ({ sdp, roomId }: { sdp: string, roomId: string }) => {
            console.log(" init offer", sdp, roomId);
            this.roomManager.onOffer(roomId, sdp)
        })

        socket.on("answer", ({ sdp, roomId }: { sdp: string, roomId: string }) => {
            console.log("init answer", sdp, roomId);
            this.roomManager.onAnswer(roomId, sdp)
        })


    }



}

