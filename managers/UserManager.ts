import { Socket } from "socket.io";
import { RoomManager } from "@/managers/RoomManger";
export interface User {
    socket: Socket,
    name: String
}



export class UserManager {
    private users: User[];
    private queue: String[];
    private roomManager: RoomManager

    constructor() {
        this.users = [];
        this.queue = [];
        this.roomManager = new RoomManager();
    }

    addUser(name: String, socket: Socket) {
        this.users.push({ name: name, socket: socket });
        this.queue.push(socket.id);
        this.clearQueue();
        this.initHandlers(socket);
    }

    removeUser(socketId: String) {
        this.users = this.users.filter(user => user.socket.id !== socketId);
        this.queue = this.queue.filter(id => id !== socketId);
    }

    clearQueue() {
        if (this.queue.length < 2) {
            return;
        }
        const user1 = this.users.find(user => user.socket.id === this.queue.pop());
        const user2 = this.users.find(user => user.socket.id === this.queue.pop());

        if (!user1 || !user2) {
            return;
        }

        this.roomManager.createRoom(user1, user2);

    }


    initHandlers(socket: Socket) {
        socket.on("offer", ({ sdp, roomId }: { sdp: string, roomId: string }) => {
            this.roomManager.onOffer(roomId, sdp)
        })

        socket.on("answer", ({ sdp, roomId }: { sdp: string, roomId: string }) => {
            this.roomManager.onAnswer(roomId, sdp)
        })


    }



}