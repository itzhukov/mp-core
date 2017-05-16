class Player {
	constructor(id = null, x = 0, y = 0){
		this.id = id;
		this.x = x;
		this.y = y;
	}

	setId(id){
		this.id = id;
	}

	moveTo(x, y){
		this.x = x;
		this.y = y;
	}
}

module.exports = Player;