import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import './App.css'
import Box from "./Box"
import rotate from '../assets/rotate.mp3'
import success from '../assets/success.mp3'
import wrong from '../assets/wrong.mp3'
import win from '../assets/win.mp3'
import start from '../assets/start.mp3'


export interface objInterface {
  id: number,
  value: number,
  isOpen: boolean
}

type memoryGameProps = {
  closeGame: () => void
  steps: number,
  setSteps: React.Dispatch<React.SetStateAction<number>>,
  time: number,
  setTime: React.Dispatch<React.SetStateAction<number>>,
  socket: any
  roomName: string
  otherArr: objInterface[]
  setOtherArr: Dispatch<SetStateAction<objInterface[]>>
}
const MemoryGame = ({ closeGame, setSteps, time, setTime, socket, roomName, otherArr, setOtherArr }: memoryGameProps) => {


  const [arr, setArr] = useState<objInterface[]>(shuffle([1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8]))
  const [obj, setObj] = useState<objInterface | null>(null)
  const [id, setId] = useState<null | number>(null)



  const clickHandler = (currentObj: objInterface, index: number) => {

    //console.log(socket.id)
    if (currentObj.value === 0) {
      let rotateSound = new Audio(wrong)
      rotateSound.play()
      return;
    }
    if (!obj || obj && obj.id !== currentObj.id) {
      let rotateSound = new Audio(rotate)
      rotateSound.play()
      setSteps((prev) => prev + 1)
      setObj({ ...currentObj })
      setId(index)
      arr[index].isOpen = true
      setArr([...arr])
      socket.emit("data", roomName, [...arr])
    }
    if (obj?.value === currentObj.value && obj.id !== currentObj.id) {
      setTimeout(() => {
        arr[index].value = 0
        arr[id!].value = 0
        setArr([...arr])
        socket.emit("data", roomName, [...arr])
        let rotateSound = new Audio(success)
        rotateSound.play()
        return;
      }, 600)
    }
    else if (obj?.value !== currentObj.value) {

      setTimeout(() => {
        arr[id!].isOpen = false
        setArr([...arr])
        socket.emit("data", roomName, [...arr])
      }, 600)

    }
  }


  useEffect(() => {
    let sum = arr.reduce((acc, current) => current.value + acc, 0)
    let otherSum = otherArr.reduce((acc: any, current: any) => current.value + acc, 0)
    if (sum === 0 || otherSum == 0) {
      setArr([...shuffle([1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8])])
      setOtherArr([...shuffle([1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8])])
      setObj(null)
      setId(null)
      let rotateSound = new Audio(win)
      rotateSound.play()
      if (sum === 0) {
        alert("You Won")
      } else if (otherSum === 0) {
        alert("Opponent Won")
      }
      closeGame()

    }
  }, [arr])

  useEffect(() => {
    let rotateSound = new Audio(start)
    rotateSound.play()
    let timerId = setInterval(() => {
      setTime((prev) => prev + 1)
    }, 1000)

    return () => {
      clearInterval(timerId)
    }
  }, [])







  return (

    <div className="flex items-center justify-evenly flex-col md:flex-row gap-y-5">
      <div className="">
        <h3 className='text-center'>Time: {time} s</h3>
        {/* <h3 className='text-center'>Steps: {steps}</h3> */}
        <h2 className="text-center">You </h2>
        <div className="container">
          {arr.map((item, index) => <div
            key={item.id}
            onClick={() => clickHandler(item, index)}
            className="">
            <Box
              value={item.value}
              isOpen={item.isOpen}
            />
          </div>
          )}
        </div>
      </div>

      <div className="">
        {/* <h3 className='text-center'>Time: {time} s</h3> */}
        {/* <h3 className='text-center'>Steps: {steps}</h3> */}
        <h2 className="text-center">Opponent Game </h2>
        <div className="container">
          {otherArr.length > 0 && otherArr.map((item: any) => <div
            key={item?.id}
            className="">
            <Box
              value={item?.value}
              isOpen={item?.isOpen}
            />
          </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MemoryGame


export function shuffle(array: number[]) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  const arrOfObj = array.map((item, index) => {
    return { id: index, value: item, isOpen: false }
  })
  return arrOfObj;
}
