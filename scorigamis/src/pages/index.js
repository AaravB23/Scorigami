import Papa from "papaparse";
import { useEffect, useState } from "react";
import ScoreGrid from "./components/ScoreGrid";
import NavControls from "./components/NavControls";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export default function Home() {
  const [data, setData] = useState([]);
  const [scoreSet, setScoreSet] = useState(new Set());
  const [xStart, setXStart] = useState(0);
  const [yStart, setYStart] = useState(0);
  const [xMax, setXMax] = useState(0);
  const [yMax, setYMax] = useState(0);

  const sliceSize = 10;

  useEffect(() => {
    fetch("/nfl_scores_cleaned.csv")
      .then((res) => res.text())
      .then((text) => {
        const result = Papa.parse(text, { 
          header: true,
          skipEmptyLines: true,
          transformHeader: h => h.trim(),
         });

        console.log("First row object:", result.data[0]); 

        setData(result.data);
        setScoreSet(new Set(result.data.map(row => `${row.PtsW}-${row.PtsL}`)));
        
        const winningScores = result.data.map(row => Number(row.PtsW));
        const losingScores = result.data.map(row => Number(row.PtsL));

        setXMax(Math.max(...winningScores) || 0);
        setYMax(Math.max(...losingScores) || 0);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Scorigami Explorer</h1>
      <ScoreGrid scoreSet={scoreSet} xStart={xStart} yStart={yStart} sliceSize={sliceSize}/>
      <NavControls xStart={xStart} yStart={yStart} sliceSize={sliceSize} setXStart={setXStart} setYStart={setYStart} xMax={xMax} yMax={yMax} />
    </div>
  );
}