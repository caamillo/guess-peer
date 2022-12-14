import { useEffect, useState } from 'react';

function App() {

    const [room, setRoom] = useState(null)
    const [usrid, setUsrId] = useState(null)

    const cooldown = 1E3

    const sendCommand = async (cmd, ...args) => {
        fetch('http://localhost:5001/sendCommand?' + new URLSearchParams({
            cmd: cmd,
            args: [args]
        }))
        .then(res => res.json())
        .then(data => console.log(data))
    }

    const joinRoom = () => {
        const roomid = document.getElementById('roomidtxt').value.trim()
        console.log('Joining ' + roomid)
        fetch('http://localhost:5001/joinroom?' + new URLSearchParams({
            usrid: usrid == null? '' : usrid,
            roomid: roomid
        }))
        .then(res => res.json())
        .then(data => {
            setUsrId(data.usrid)
            setRoom(data.room)
        })
    }

    const createRoom = () => {
        fetch('http://localhost:5001/createroom')
        .then(res => res.json())
        .then(data => {
            setUsrId(data.usrid)
            setRoom(data.room)
        })
    }
    useEffect(() => {
        const t = setInterval(async () => {
            console.log('Fetching...')
            console.log(room)
            fetch('http://localhost:5001/getroom?' + new URLSearchParams({
                usrid: usrid == null? '' : usrid
            }))
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setRoom(data.room)
            })
        }, cooldown)
        const leaveRoom = async () => {
            await fetch('http://localhost:5001/leaveroom?usrid=' + usrid)
        }
        window.addEventListener('beforeunload', leaveRoom)
        return () => {
            window.removeEventListener('beforeunload', leaveRoom)
            clearInterval(t)
        }
    })


    return (
        <div>
            <p>userid:</p>
            <span>{ usrid && usrid }</span>
            <p>Actual Room:</p>
            <span>{ room && room.roomid }</span>
            <br></br>
            <p>Users:</p>
            { room && room.usrids.map(usrid => {
                return (
                    <div key={ usrid } >
                        <span>{ usrid }</span>
                        <br></br>
                    </div>
                )
            }) }
            <br></br>
            <button onClick={ () => createRoom() }>Create Room</button>
            <input id='roomidtxt' type='text'/>
            <button onClick={ () => joinRoom() }>Join Room</button>
            <br></br>
            <button onClick={ () => fetch('http://localhost:5001/sendCommand?' + new URLSearchParams({
                cmd: 'start',
                params: JSON.stringify([room.roomid])
            })).then(res => res.json()).then(data => console.log(data)) }>Test Command</button>
        </div>
    );
}

export default App