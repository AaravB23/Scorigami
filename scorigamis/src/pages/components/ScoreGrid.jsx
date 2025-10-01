import GridCell from "./GridCell";

export default function ScoreGrid({ scoreSet, xStart, yStart, sliceSize }) {
  return (
    <div>
      <div className="flex">
        <div className="w-12 h-12 flex-shrink-0" />
        
        {Array.from({ length: sliceSize }).map((_, colIndex) => {
          const x = xStart + colIndex;
          return (
            <div key={`header-${x}`} className="w-12 h-12 flex items-center justify-center font-bold text-gray-700">
              {x}
            </div>
          );
        })}
      </div>

      {Array.from({ length: sliceSize }).map((_, rowIndex) => {
        const y = yStart + rowIndex;
        return (
          <div key={`row-${y}`} className="flex">
            <div className="w-12 h-12 flex items-center justify-center font-bold text-gray-700 flex-shrink-0">
              {y}
            </div>
            
            {Array.from({ length: sliceSize }).map((_, colIndex) => {
              const x = xStart + colIndex;
              const winningScore = Math.max(x, y);
              const losingScore = Math.min(x, y);
              const key = `${winningScore}-${losingScore}`;

              return <GridCell key={`${x}-${y}`} x={x} y={y} occurred={scoreSet.has(key)} />;
            })}
          </div>
        );
      })}
    </div>
  );
}