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
            <div className="flex justify-center">
                <p>Click on a cell in the grid to see details.</p>
            </div>
        );
    }

    const match = findGames(selectedCell.x, selectedCell.y);
    console.log(match);

    let content;
    if (match) {
        if (selectedCell.x >= selectedCell.y) {
            content = (
                <div>
                    <p>
                        Winners: <b>{match.W_Team} - {selectedCell.x} pts</b>
                        <br />
                        Losers: <b>{match.L_Team} - {selectedCell.y} pts</b>
                        <br />
                        Last Occured: {match.Month}<b> / </b>{match.Day}<b> / </b>{match.Year}
                    </p>
                </div>
            )
        } 
    } else {
        content = (
            <div>
                <p>Winner: {selectedCell.x} pts</p>
                <p>Loser: {selectedCell.y} pts</p>
                <p>Score has never happened!</p>
            </div>
        )
    }

    return <div className="flex justify-center">{content}</div>
}