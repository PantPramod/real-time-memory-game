import { FormEvent, useEffect, useMemo, useState } from 'react'
import './Home.css'
import MemoryGame, { objInterface, shuffle } from '../components/MemoryGame'
import { io } from 'socket.io-client'

const Home = () => {
    const socket = useMemo(() => io("https://memory-game-8k1p.onrender.com"), [])

    const [message, setMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [start, setStart] = useState(false)
    const [steps, setSteps] = useState(0)
    const [time, setTime] = useState(0)
    const [mode, setMode] = useState<'create' | 'join'>('create')

    const [roomName, setRoomName] = useState('')

    const [socketId, setSocketId] = useState('')

    const [otherArr, setOtherArr] = useState<objInterface[]>(shuffle([1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8]))

    const [isEnteredRoom, setIsEnteredRoom] = useState(false)

    const joinRoomHandler = (e: FormEvent) => {
        e.preventDefault()
        socket.emit("joinroom", roomName)
    }

    const createRoomHandler = (e: FormEvent) => {
        e.preventDefault()
        //console.log(roomName)
        socket.emit("createroom", roomName)
    }



    useEffect(() => {
        socket.on("connect", () => {
            //console.log("user connected", socket.id)
            setSocketId(socket.id!)
        });

        socket.on('data', (data: any, id) => {
            //console.log(data)
            if (id !== socketId) {
                setOtherArr([...data])
            }

        })

        socket.on('startgame', (arg: boolean) => {
            setStart(arg)
            setSteps(0)
            setTime(0)
        })

        socket.on("isroomcreated", (created, msg) => {
            if (created) {
                setMessage(msg);
                setErrorMessage('');
                setIsEnteredRoom(true)
            } else {
                setErrorMessage(msg)
                setMessage('')
                setIsEnteredRoom(false)
            }
        })

        socket.on("isroomjoined", (joined, msg) => {
            if (joined) {
                setMessage(msg);
                setErrorMessage('');
                setIsEnteredRoom(true)
            } else {
                setErrorMessage(msg)
                setMessage('')
                setIsEnteredRoom(false)
            }
        })

    }, [])

    return (
        <div>
            {/* <h1>Socket Id : {socketId}</h1> */}
            {
                !isEnteredRoom ?
                    <>
                        <div className='flex items-center justify-center w-full mt-20'>
                            <button
                                onClick={() => { setMode('create'); setMessage(''); setErrorMessage('') }}
                                style={mode === "create" ? { background: "#a312a3", color: "white" } : {}}
                                className='border border-black  p-2 px-5 w-[100px] '
                            >
                                Create
                            </button>
                            <button
                                onClick={() => { setMode('join'); setMessage(''); setErrorMessage('') }}
                                style={mode === "join" ? { background: "#9b119b", color: 'white' } : {}}
                                className='border border-black p-2 px-5 w-[100px] '>Join </button>
                        </div>
                        {
                            mode === "create" ?
                                <form onSubmit={createRoomHandler}>

                                    <input
                                        type='text'
                                        placeholder='Room Name'
                                        value={roomName}
                                        onChange={e => setRoomName(e.target.value)}
                                        className='input'
                                    />
                                    <button
                                        type='submit'
                                        className='mx-auto block bg-purple-500 mt-2 text-white p-2 px-10 rounded-md'
                                    >Create Room
                                    </button>
                                </form> :
                                <form onSubmit={joinRoomHandler}>

                                    <input
                                        type='text'
                                        placeholder='Room Name'
                                        value={roomName}
                                        onChange={e => setRoomName(e.target.value)}
                                        className='input'
                                    />
                                    <button
                                        type='submit'
                                        className='mx-auto block bg-blue-500 mt-2 text-white p-2 px-10 rounded-md'

                                    >Join Room
                                    </button>
                                </form>
                        }


                        {errorMessage && <p className='text-red-600 text-center'>{errorMessage}</p>}


                    </> :
                    <>
                        {message && <p className='text-green-600 text-center'>{message}</p>}
                        {
                            start &&
                            <>
                                <MemoryGame
                                    closeGame={() => setStart(false)}
                                    steps={steps}
                                    setSteps={setSteps}
                                    time={time}
                                    setTime={setTime}
                                    socket={socket}
                                    roomName={roomName}
                                    otherArr={otherArr}
                                    setOtherArr={setOtherArr}
                                />
                            </>
                        }
                    </>
            }
        </div>
    )
}

export default Home
