import Board from "./Board.js";

export default class App {
	static async main(img, w=4, h=4) {
		const board = new Board(w, h, img);
		window.app.appendChild(board.dom);
		setTimeout(() => {
			board.shuffle();
		}, 10);
		// window.shuffle.addEventListener('click', () => {
		// 	board.shuffle();
		// });
		// window.solve.addEventListener('click', () => {
		// 	board.solve();
		// });
	}
}