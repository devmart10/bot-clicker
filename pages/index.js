import { useEffect, useState, useRef } from "react"

const useAnimationFrame = callback => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef();
  const previousTimeRef = useRef();

  const animate = time => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime)
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // Make sure the effect runs only once
}

export default function Home() {
  const [scrap, setScrap] = useState(0)
  const [batteries, setBatteries] = useState(0)
  const [motherboards, setMotherboards] = useState(0)
  const [bots, setBots] = useState(0)

  // const [exploreTimeRemaining, setExploreTimeRemaining] = useState(0)

  // constants
  const botCost = {
    scrap: 25,
    batteries: 2,
    motherboards: 1
  }
  const botScrapMultiplier = .00001
  // useEffect(() => {
  //   botCost.scrap *= 1.1
  //   botScrapMultiplier.current *= 1.1
  // })
  const exploreTimeBase = 10
  const batteryChance = .1
  const motherboardChance = .05

  const collectScrap = () => {
    setScrap(scrap => scrap + 1)
  }

  const buildBot = () => {
    if (checkBotRequirements()) {
      setBots(bots => bots + 1)
      setScrap(scrap => scrap - botCost.scrap)
      setBatteries(batteries => batteries - botCost.batteries)
      setMotherboards(motherboards => motherboards - botCost.motherboards)
    }
  }

  const checkBotRequirements = () => {
    return (scrap >= botCost.scrap && batteries >= botCost.batteries && motherboards >= botCost.motherboards)
  }

  // const startExplore = () => {
  //   const interval = setInterval(() => {
  //     setExploreTimeRemaining(exploreTimeRemaining - 1);
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }

  const explore = () => {
    const rollBatteries = Math.random()
    const rollMotherboard = Math.random()

    if (rollBatteries <= batteryChance) {
      setBatteries(batteries + 1)
    }

    if (rollMotherboard <= motherboardChance) {
      setMotherboards(motherboards + 1)
    }
  }

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setScrap(scrap + bots * botScrapMultiplier)
  //   }, 1000)
  //   return () => clearInterval(timer)
  // }, [scrap, bots])

  useEffect(() => {
    setScrap(prevScrap => (prevScrap + bots * parseFloat(botScrapMultiplier)))
  }, [scrap, bots])

  return (
    <main className="h-screen p-4 bg-slate-50">
      <h1 className="mb-2 text-3xl font-bold underline">
        Bot Clicker Game
      </h1>
      <div className="p-2 mb-4 border border-gray-500 rounded-md info-card ">
        <p>scrap {parseFloat(scrap).toFixed(2)}</p>
        <p>batteries {batteries}</p>
        <p>motherboards {motherboards}</p>
        <p>bots {bots}</p>
        {/* {exploreTimeRemaining > 0 && <p>exploration returns in: {exploreTimeRemaining}</p>} */}
      </div>
      <div className="p-2 border border-gray-500 rounded-md buttons">
        <button className="p-2 mr-4 rounded-md bg-slate-300" onClick={collectScrap}>Collect scrap</button>
        <button className="p-2 mr-4 rounded-md bg-slate-300" onClick={explore}>Explore wasteland</button>
        <button className="p-2 mr-4 rounded-md bg-slate-300" onClick={buildBot}>Build bot ({botCost.scrap})</button>
      </div>
    </main>
  )
}