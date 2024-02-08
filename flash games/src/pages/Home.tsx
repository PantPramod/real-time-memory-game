import { useState } from 'react'
import './Home.css'
import MemoryGame from '../components/MemoryGame'

const Home = () => {
    const [start, setStart] = useState(false)
    const [steps, setSteps] = useState(0)
    const [time, setTime] = useState(0)

    const startHandler = () => {
        setStart(true)
        setSteps(0)
        setTime(0)
    }

    return (
        <div>
            {
                start ?
                    <>
                        <MemoryGame
                            closeGame={() => setStart(false)}
                            steps={steps}
                            setSteps={setSteps}
                            time={time}
                            setTime={setTime}
                        />
                    </>
                    :
                    <>

                        <button
                            onClick={startHandler}
                            className='btn'>Start New Game</button>

                        {!!time && <>
                            <h3 className='text-center'>Time: {time}</h3>
                            <h3 className='text-center'>Steps: {steps}</h3>
                        </>
                        }

                    </>

            }



        </div>
    )
}

export default Home
