export default function NavControls({ xStart, yStart, sliceSize, setXStart, setYStart, xMax, yMax }) {
  const buttonClass = "flex items-center justify-center p-3 bg-slate-700 rounded-lg shadow-md hover:bg-slate-600 active:shadow-inner transition-all text-white font-semibold";

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      <button
        className={buttonClass}
        onClick={() => setXStart(Math.max(0, xStart - sliceSize/2))}
      >
        Left
      </button>
      <button
        className={buttonClass}
        onClick={() => setXStart(Math.min(xMax, xStart + sliceSize/2))}
      >
        Right
      </button>
      <button
        className={buttonClass}
        onClick={() => setYStart(Math.max(0, yStart - sliceSize/2))}
      >
        Up
      </button>
      <button
        className={buttonClass}
        onClick={() => setYStart(Math.min(yMax, yStart + sliceSize/2))}
      >
        Down
      </button>
    </div>
  );
}