import Piece from "./Piece.js";

export default class Board {
	constructor(w, h, img) {
		this.w = w;
		this.h = h;
		this.c = this.w - 1;
		this.r = this.h - 1;
		this.img = img;
		this.pieces = [];
		this.createPieces();
		this.trouAlea = false;
	}
	get dom() {
		if (!this._dom) {
			this._dom = document.createElement('div');
			this._dom.id = 'board';
			this.dom.style.setProperty('--w', this.w);
			this.dom.style.setProperty('--h', this.h);
			this._dom.obj = this;
			var backdrop = this._dom.appendChild(document.createElement('div'));
			backdrop.classList.add('backdrop');
			backdrop.style.backgroundImage = `url(${this.img})`;

			this.pieces.forEach(piece => {
				this._dom.appendChild(piece.dom);
			});
			this.pieces.pop();
			this._dom.addEventListener('click', (e) => {
				if (e.ctrlKey) {
					this.solve();
					e.stopPropagation();
					return;
				}
				if (this.solved) {
					this.shuffle();
					e.stopPropagation();
					return;
				}
			}, true);
			this._dom.addEventListener('dblclick', (e) => {
				if (e.ctrlKey) {
					this.shuffle();
				}
			});
		}
		return this._dom;
	}
	shuffle() {
		this.solved = false;
		var poss = [];
		for (let y = 0; y < this.h; y += 1) {
			for (let x = 0; x < this.w; x += 1) {
				poss.push([x, y]);
			}
		}
		if (!this.trouAlea) {
			poss.pop();
		}
		poss.sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5);
		if(!this.solvable(poss)) {
			[poss[0], poss[1]] = [poss[1], poss[0]];
		}
		this.pieces.forEach((piece) => {
			[piece.c, piece.r] = poss.pop();
			piece.dom.classList.toggle('correct', piece.correct);
		});
		[this.c, this.r] = poss.pop() || [this.w - 1, this.h - 1];
		return this;
	}
	get solved() {
		var resultat = this.pieces.every(piece => piece.correct);
		this.dom.classList.toggle('solved', resultat);
		return resultat;
	}
	set solved(value) {
		this.dom.classList.toggle('solved', value);
	}
	solvable (moves) {
		var i = 0;
		moves = moves.map(move => move.toString());
		for (let y = 0; y < this.h; y += 1) {
			for (let x = 0; x < this.w; x += 1) {
				let pos = moves.indexOf([x, y].toString());
				i += pos;
				moves.splice(pos, 1);
			}
		}
		return i % 2 === 0;

	}
	async solve() {
		var piece;
		do {
			if (this.c === this.w - 1 && this.r === this.h - 1) {
				piece = this.pieces.find(piece => !piece.correct);
			} else {
				piece = this.pieces.find(piece => piece.c0 === this.c && piece.r0 === this.r);
			}
			if (!piece) break;
			piece.move();
		} while (piece);
		return this;
	}
	createPieces() {
		for (let y = 0; y < this.h; y += 1) {
			for (let x = 0; x < this.w; x += 1) {
				const piece = new Piece(this, x, y);
				piece.addEventListener('correct', (e) => {
					console.log('correct', e);
					if (this.solved) console.log('Bravo !');
				});
				this.pieces.push(piece);
			}
		}
		// this.pieces.pop();
	}
	removePiece(piece) {
		const index = this.pieces.indexOf(piece);
		if (index !== -1) {
			this.pieces.splice(index, 1);
			this.dom.removeChild(piece.dom);
		}
	}
}