export default function InfoArea({selectedCell, games}) {

    function findGames(x, y) {
        if (!games || games.length === 0) return null;

        return games.find( (game) =>  
            String(game.PtsW).trim() === String(x) &&
            String(game.PtsL).trim() === String(y)
        );
    }

    if (!selectedCell) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-6 h-full">
                <p className="text-slate-500">Click on a cell in the grid to see details.</p>
                <p className="text-sm text-slate-400 mt-2">Green cells are scores that have occurred.</p>
            </div>
        );
    }

    const match = findGames(selectedCell.x, selectedCell.y);
    console.log(match);

    let content;
    if (match) {
        if (selectedCell.x >= selectedCell.y) {
            content = (
                <div className="p-4">
                    <h2 className="text-2xl font-bold text-slate-800">{selectedCell.x} - {selectedCell.y}</h2>
                    <p className="text-sm text-slate-500">Selected Score</p>

                    <h3 className="text-lg font-bold text-slate-800 mb-3 border-b pb-2">
                        Last Occured:
                    </h3>
                    <p className="text-slate-600 mb-1">
                        <span className="font-bold">{match.W_Team}</span> - <span className="font-bold">{selectedCell.x} pts</span> (Winner)
                    </p>
                    <p className="text-slate-600 mb-1">
                        <span className="font-bold">{match.L_Team}</span> - <span className="font-bold">{selectedCell.y} pts</span> (Loser)
                    </p>
                    <p className="text-sm text-slate-500">
                        Date: {match.Month}/{match.Day}/{match.Year}
                    </p>
                </div>
            )
        } 
    } else {
        content = (
            <div className="p-4 text-center">
                <p className="text-slate-600 font-semibold mb-2">
                Winner: <span className="font-bold">{selectedCell.x} pts</span>
                </p>
                <p className="text-slate-600 font-semibold mb-2">
                    Loser: <span className="font-bold">{selectedCell.y} pts</span>
                </p>
                <div className="mt-4 text-sm bg-amber-100 text-amber-800 p-3 rounded-lg">
                    This score has never happened!
                </div>
            </div>
        )
    }

    return <div className="flex justify-center">{content}</div>
}