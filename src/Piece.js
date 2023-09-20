export default class Piece extends EventTarget {
	constructor(board, c, r) {
		super();
		this.board = board;
		this.c0 = c;
		this.r0 = r;
		this._c = c;
		this._r = r;
	}
	get dom() {
		if (!this._dom) {
			this._dom = document.createElement('div');
			this._dom.classList.add('piece');
			this._dom.style.backgroundImage = `url(${this.board.img})`;
			this._dom.style.backgroundPosition = `${this.c * 100 / (this.board.w - 1)}% ${this.r * 100 / (this.board.h - 1)}%`;
			this._dom.style.setProperty('--c', this.c);
			this._dom.style.setProperty('--r', this.r);
			this._dom.obj = this;
			this._dom.addEventListener('click', this.evt.click);
		}
		return this._dom;
	}
	get c() {
		return this._c;
	}
	set c(value) {
		this._c = value;
		this.dom.style.setProperty('--c', this.c);
	}
	get r() {
		return this._r;
	}
	set r(value) {
		this._r = value;
		this.dom.style.setProperty('--r', this.r);
	}
	move() {
		[this.c, this.board.c, this.r, this.board.r] = [this.board.c, this.c, this.board.r, this.r];
		return new Promise(resolve => {
			this._dom.classList.remove('correct');
			this.dom.classList.add('en-mouvement');
			this.dom.addEventListener('transitionend', (e) => {
				this.dom.classList.toggle('correct', this.correct);
				this.dom.classList.remove('en-mouvement');
				if (this.correct) this.dispatchEvent(new Event('correct'));
				resolve();
			}, { once: true });
		});
	}
	moveGroup() {
		var props = [];
		if (this.board.c === this.c) {
			props.push('r', 'c', Math.sign(this.board.r - this.r));
		}
		if (this.board.r === this.r) {
			props.push('c', 'r', Math.sign(this.board.c - this.c));
		}
		var [c, r, s] = props;
		let pieces = this.board.pieces.filter(piece => {
			return (piece[r] === this[r])
				&& (s * (piece[c] - this.board[c]) < 0)
				&& (s * (piece[c] - this[c]) >= 0);
		});
		pieces.sort((a, b) => (b[c] - a[c]) * Math.sign(s));
		pieces.forEach(piece => {
			piece.move();
		});
	}

	get correct() {
		return this.c === this.c0 && this.r === this.r0;
	}
	evt = {
		click: (e) => {
			if (e.target === this.dom) {
				this.moveGroup();
			}
		},
	};
}