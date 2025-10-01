import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

import { db } from "./firebase"
import ScoreGrid from "./components/ScoreGrid";
import NavControls from "./components/NavControls";

export default function Home() {
  const [data, setData] = useState([]);
  const [scoreSet, setScoreSet] = useState(new Set());
  const [xStart, setXStart] = useState(0);
  const [yStart, setYStart] = useState(0);
  const [xMax, setXMax] = useState(0);
  const [yMax, setYMax] = useState(0);

  const sliceSize = 10;

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
      }
    }

    fetchScores();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Scorigami Explorer</h1>
      <ScoreGrid scoreSet={scoreSet} xStart={xStart} yStart={yStart} sliceSize={sliceSize}/>
      <NavControls xStart={xStart} yStart={yStart} sliceSize={sliceSize} setXStart={setXStart} setYStart={setYStart} xMax={xMax} yMax={yMax} />
    </div>
  );
}