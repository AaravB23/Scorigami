import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

import { db } from "../lib/firebase"
import ScoreGrid from "../components/ScoreGrid";
import NavControls from "../components/NavControls";
import InfoArea from "../components/InfoArea";

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
    <div className="bg-slate-100 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7x1 mx-auto">
        <header className="mb-6 bg-blue-100 rounded-lg p-6 text-center shadow-sm">
          <h1 className="text-4xl font-sans font-bold text-emerald-600 tracking-tight">Scorigami Explorer</h1>
          <p className="text-slate-600 font-sans mt-1">An interactive grid of every unique score in the NFL.</p>
          <div className="text-xs font-sans mt-2">
            <p className="text-slate-900">Data Source:</p> 
            <a className="text-blue-700"
              href="https://www.pro-football-reference.com/boxscores/game-scores.htm"
              target="_blank">
              Pro Football Reference
            </a>
          </div>
        </header>
      
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-1">
          <div className="lg:col-span-2 flex flex-col items-center">
            <ScoreGrid scoreSet={scoreSet} xStart={xStart} yStart={yStart} sliceSize={sliceSize} onCellClick={onCellClick}/>
          </div>
          <aside className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="font-bold text-lg text-slate-700 mb-3 text-center">Controls</h2>
              <NavControls xStart={xStart} yStart={yStart} sliceSize={sliceSize} setXStart={setXStart} setYStart={setYStart} xMax={xMax} yMax={yMax} />
            </div>

            <div className="bg-white rounded-lg shadow-md min-h-[18rem]">
              <InfoArea selectedCell={selectedCell} games={data} />
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}