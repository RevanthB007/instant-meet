import { User } from "@/managers/UserManager";

interface Room {
    user1: User,
    user2: User,
}
let GLOBAL_ROOM_ID = 1

export class RoomManager {
    private rooms: Map<string, Room>;
    constructor() {
        this.rooms = new Map<string, Room>();
    }

    createRoom(user1: User, user2: User) {
        const roomId = this.generate().toString();
        this.rooms.set(roomId.toString(), {
            user1,
            user2,
        })
        console.log("send-offer",roomId);
        console.log("user",user1);
        user1.socket.emit("send-offer",{
            roomId
        })
    }

    onOffer(roomId:string,sdp:string){
        console.log("on offer",roomId,sdp);
        const user2 = this.rooms.get(roomId)?.user2;
        console.log("user",user2);
        user2?.socket.emit("offer",{
            roomId,
            sdp
        })
    }

    onAnswer(roomId:string,sdp:string){
        console.log("on answer",roomId,sdp);
        const user1 = this.rooms.get(roomId)?.user1;
        user1?.socket.emit("answer",{
            roomId,
            sdp
        })
    }

    generate() {
        return GLOBAL_ROOM_ID++
    }
}