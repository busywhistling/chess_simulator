// Third-party imports
import { useSelector } from "react-redux";

// Global imports
import { selectBoard, selectHighlights } from "@/redux/chessboardSlice";

// Local imports
import Tile from "../Tile";
import { chessboardPositions } from "./chessboardPosition";

////////////////////////////////////////////////////////////////////////////////

// const range = (n: number): number[] => [...Array(n).keys()]

interface ChessboardProps {
	inputAllowed: boolean;
}

const Chessboard = ({ inputAllowed }: ChessboardProps) => {
	const board = useSelector(selectBoard);
	const highlights = useSelector(selectHighlights);

	console.log("BOARD \n", board);
	const getPieceImageFilename = (xCoordinate: number, yCoordinate: number) =>
		board[yCoordinate][xCoordinate] == null
			? undefined
			: `${board[yCoordinate][xCoordinate].type}_${board[yCoordinate][xCoordinate].color}`;
	const isTileHighlighted = (xCoordinate: number, yCoordinate: number) =>
		highlights[yCoordinate][xCoordinate];
	// console.log(chessboardPositions)

	return (
		<div className="boardContainer">
			<div id="chessboard">
				{chessboardPositions.map(({ label, xCoordinate, yCoordinate, tileColor }) => (
					<Tile
						key={label}
						pos={label}
						piece={getPieceImageFilename(xCoordinate, yCoordinate)}
						tileColor={tileColor}
						highlight={isTileHighlighted(xCoordinate, yCoordinate)}
						inputAllowed={inputAllowed}
					/>
				))}
			</div>
		</div>
	);
};

export default Chessboard;
