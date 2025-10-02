import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

import { db } from "./firebase"
import ScoreGrid from "./components/ScoreGrid";
import NavControls from "./components/NavControls";
import InfoArea from "./components/InfoArea";

export default function Home() {
  const [data, setData] = useState([]);
  const [scoreSet, setScoreSet] = useState(new Set());
  const [xStart, setXStart] = useState(0);
  const [yStart, setYStart] = useState(0);
  const [xMax, setXMax] = useState(0);
  const [yMax, setYMax] = useState(0);
  const [selectedCell, setSelectedCell] = useState(null);

  const sliceSize = 10;

  function onCellClick(x, y) {
    console.log("Cell data received in Home component:", x, y);
    setSelectedCell({ x, y });
  }

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const query = await getDocs(collection(db, "games"));
        const games = query.docs.map(doc => doc.data());

        console.log("First row obj:", games[0]);

        setData(games);
        setScoreSet(new Set(games.map(row => `${row.PtsW}-${row.PtsL}`)));

        const winningScores = games.map(row => Number(row.PtsW));
        const losingScores = games.map(row => Number(row.PtsL));

        setXMax(Math.max(...winningScores) || 0);
        setYMax(Math.max(...losingScores) || 0);
      } catch (err) {
        console.error("Error fetching scores: ", err);
        setData([]);
      }
    }

    fetchScores();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 p-2">Scorigami Explorer</h1>
      <div className="flex p-4">
        
        <ScoreGrid scoreSet={scoreSet} xStart={xStart} yStart={yStart} sliceSize={sliceSize} onCellClick={onCellClick}/>
        <NavControls xStart={xStart} yStart={yStart} sliceSize={sliceSize} setXStart={setXStart} setYStart={setYStart} xMax={xMax} yMax={yMax} />

        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h2 className="font-bold">Selected Score</h2>
          <InfoArea selectedCell={selectedCell} games={data} />
        </div>
      </div>
    </div>
  );
}