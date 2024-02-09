import { FormEvent, useEffect, useMemo, useState } from 'react'
import './Home.css'
import MemoryGame, { objInterface, shuffle } from '../components/MemoryGame'
import { io } from 'socket.io-client'

const Home = () => {
    const socket = useMemo(() => io("https://memory-game-8k1p.onrender.com"), [])
    // const socket = useMemo(() => io("http://localhost:8000"), [])

    const [message, setMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [start, setStart] = useState(false)
    const [steps, setSteps] = useState(0)
    const [time, setTime] = useState(0)
    const [mode, setMode] = useState<'create' | 'join'>('create')

    const [roomNo, setRoomNo] = useState<null | number>(null)

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
            // console.log(data, id)
            if (id !== socketId) {
                setOtherArr([...data])
            }

        })

        socket.on('startgame', (arg: boolean) => {
            setStart(arg)
            setSteps(0)
            setTime(0)
        })

        socket.on("isroomcreated", (created, msg, rn) => {
            if (created) {
                setRoomNo(rn)
                setMessage(msg);
                setErrorMessage('');
                setIsEnteredRoom(true)
                
            } else {
                setErrorMessage(msg)
                setMessage('')
                setIsEnteredRoom(false)
            }
        })

        socket.on("isroomjoined", (joined, msg, rn) => {
            if (joined) {
                setRoomNo(rn)
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
        <div className=''>
            {/* <h1>Socket Id : {socketId}</h1> */}
            {
                !isEnteredRoom ?
                    <div
                        style={{
                            backgroundImage: `url(${'/images/bg.jpg'})`,
                        }}
                        className='bg-cover h-[100vh] '
                    >
                        <div className='flex items-center justify-center w-full py-10 font-["Honk"] text-2xl tracking-[100px]'>
                            <button
                                onClick={() => { setMode('create'); setMessage(''); setErrorMessage(''); setRoomName('') }}
                                style={mode === "create" ? { background: "#a312a3" } : {}}
                                className='tracking-[3px] border border-white  p-2 px-5  text-white uppercase'
                            >
                                Create
                            </button>
                            <button
                                onClick={() => { setMode('join'); setMessage(''); setErrorMessage(''); setRoomNo(null) }}
                                style={mode === "join" ? { background: "#9b119b", color: 'white' } : {}}
                                className='tracking-[3px] border border-white p-2 px-5  text-white uppercase'>Join </button>
                        </div>
                        {
                            mode === "create" ?
                                <form onSubmit={createRoomHandler}>


                                    <button
                                        type='submit'
                                        className='bg-transparent  mx-auto block border border-blue-500 mt-10 text-blue-500 p-2 px-10 rounded-md'
                                    >Create Room
                                    </button>
                                </form> :
                                <form onSubmit={joinRoomHandler}>

                                    <input
                                        type='text'
                                        placeholder='Enter Room Name'
                                        value={roomName}
                                        onChange={e => setRoomName(e.target.value)}
                                        className='input bg-transparent'
                                    />
                                    <button
                                        type='submit'
                                        className='bg-transparent  mx-auto block border border-blue-500 mt-10 text-blue-500 p-2 px-10 rounded-md'

                                    >Join Room
                                    </button>
                                </form>
                        }
                        {errorMessage && <p className='text-red-600 text-center'>{errorMessage}</p>}
                    </div> :
                    <div className=''>


                        {
                            start ?
                                <>
                                    <MemoryGame
                                        closeGame={() => setStart(false)}
                                        steps={steps}
                                        setSteps={setSteps}
                                        time={time}
                                        setTime={setTime}
                                        socket={socket}
                                        roomName={roomNo}
                                        otherArr={otherArr}
                                        setOtherArr={setOtherArr}
                                    />
                                </>
                                :
                                <div
                                    style={{
                                        backgroundImage: `url(${'/images/bg2.jpg'})`,
                                    }}
                                    className='h-screen bg-cover bg-no-repeat flex items-center justify-center flex-col gap-y-5'>
                                    {message && <p className='uppercase text-white text-center text-2xl'>{message}</p>}
                                    <p>{`http://memorygame124.netlify.app/`}</p>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(String(roomNo))}
                                        className='bg-green-600 text-white px-4 py-2 rounded-md'>Copy Room No</button>
                                    <div className="loader"></div>
                                </div>
                        }
                    </div>
            }
        </div>
    )
}

export default Home
