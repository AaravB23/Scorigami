export default function GridCell({x, y, occurred, onCellClick }) {
  const divColor = x < y ? 'bg-black' :
        occurred ? 'bg-green-500' : 'bg-gray-100';

  const hoverClass = x < y ? 'hover:bg-black' : 
        occurred ? 'hover:bg-green-700' : 'hover:bg-gray-300';

  return (
    <div 
      onClick={() => x >= y ? onCellClick(x, y) : null}
      className={`w-12 h-12 border border-blue-300 ${divColor} ${hoverClass}`}
    >
    </div>
  );
}