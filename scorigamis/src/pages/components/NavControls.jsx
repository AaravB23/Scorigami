export default function NavControls({ xStart, yStart, sliceSize, setXStart, setYStart, xMax, yMax }) {
  return (
    <div className="mt-4 flex gap-2 text-black-500">
      <button
        className="px-3 py-1 bg-blue-200 rounded hover:bg-blue-300"
        onClick={() => setXStart(Math.max(0, xStart - sliceSize/2))}
      >
        Left
      </button>
      <button
        className="px-3 py-1 bg-blue-200 rounded hover:bg-blue-300"
        onClick={() => setXStart(Math.min(xMax, xStart + sliceSize/2))}
      >
        Right
      </button>
      <button
        className="px-3 py-1 bg-blue-200 rounded hover:bg-blue-300"
        onClick={() => setYStart(Math.max(0, yStart - sliceSize/2))}
      >
        Up
      </button>
      <button
        className="px-3 py-1 bg-blue-200 rounded hover:bg-blue-300"
        onClick={() => setYStart(Math.min(yMax, yStart + sliceSize/2))}
      >
        Down
      </button>
    </div>
  );
}