export default function GridCell({x, y, occurred, onCellClick }) {
  const divColor = x < y ? 'bg-slate-900' : // If losing score > winning score, black out.
        occurred ? 'bg-emerald-600' : 'bg-slate-200'; // Green for scores that have happened.

  const hoverClass = x < y ? 'hover:bg-slate-900' : // If invalid, nothing happens.
        occurred ? 'hover:bg-emerald-900' : 'hover:bg-slate-300';

  // Change the cursor to indicate what's clickable.
  const cursor = x < y ? 'cursor-not-allowed' : 'cursor-pointer';

  return (
    <div 
      onClick={() => x >= y ? onCellClick(x, y) : null}
      className={`w-10 h-10 md:w-12 md:h-12 border border-slate-300
        flex items-center justify-center text-xs text-white
        transition-colors duration-200
         ${divColor} ${hoverClass} ${cursor}`}
    >
    </div>
  );
}