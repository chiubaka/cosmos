var Player = BlockGrid.extend({
	classId: 'Player',

	init: function (data) {
		BlockGrid.prototype.init.call(this, data);

		var self = this;

		this.drawBounds(false);

		this.controls = {
			key: {
				left: false,
				right: false,
				up: false,
				down: false
			}
		};

		this.width(20);
		this.height(20);
		this.translateTo(-200, -200, 0);

		if (!ige.isServer) {
			this.depth(1);
		}
		/*
		//construct a large grid ship
		grid = BlockGrid.prototype.newGridFromDimensions(10, 10);
		grid[grid.length / 2][grid[0].length / 2] = new PlayerControlBlock();
		this.setGrid(grid);
		*/

		// Define the data sections that will be included in the stream
		this.streamSections(['transform', 'score']);
	},

	/**
	 * Override the default IgeEntity class streamSectionData() method
	 * so that we can check for the custom1 section and handle how we deal
	 * with it.
	 * @param {String} sectionId A string identifying the section to
	 * handle data get / set for.
	 * @param {*=} data If present, this is the data that has been sent
	 * from the server to the client for this entity.
	 * @return {*}
	 */
	streamSectionData: function (sectionId, data) {
		// Check if the section is one that we are handling
		if (sectionId === 'score') {
			// Check if the server sent us data, if not we are supposed
			// to return the data instead of set it
			if (data) {
				// We have been given new data!
				this._score = data;
			} else {
				// Return current data
				return this._score;
			}
		} else {
			// The section was not one that we handle here, so pass this
			// to the super-class streamSectionData() method - it handles
			// the "transform" section by itself
			return IgeEntity.prototype.streamSectionData.call(this, sectionId, data);
		}
	},

	/**
	 * Called every frame by the engine when this entity is mounted to the
	 * scenegraph.
	 * @param ctx The canvas context to render to.
	 */
	tick: function (ctx) {
		/* CEXCLUDE */
		/* For the server: */
		if (ige.isServer) {
			// This determines how fast you can rotate your spaceship
			var angularImpulse = -5000;

			if (this.controls.key.left) {
				this._box2dBody.ApplyTorque(angularImpulse);
			}
			if (this.controls.key.right) {
				this._box2dBody.ApplyTorque(-angularImpulse);
			}

			/* Linear motion */
			if (this.controls.key.up || this.controls.key.down) {
				var linearImpulse;
				if (this.controls.key.up) {
					linearImpulse = 100;
				} else if (this.controls.key.down) {
					linearImpulse = -100;
				}

				// the "- Math.PI/2" below makes the ship move forward and backwards, instead of side to side.
				var angle = this._box2dBody.GetAngle() - Math.PI/2;

				var x_comp = Math.cos(angle) * linearImpulse;
				var y_comp = Math.sin(angle) * linearImpulse;

				var impulse = new ige.box2d.b2Vec2(x_comp, y_comp);
				var location = this._box2dBody.GetWorldCenter(); //center of gravity

				var grid = self.getGrid();
				for (row = 0; row < grid.length; row++) {
					var blockRow = grid[row];
					for (col = 0; col < blockRow.length; col++) {
						var block = blockRow[col];

						if(block && block.classId() === "EngineBlock") {
							self._box2dBody.ApplyImpulse(impulse, location);
						}
					}
				}
			}

			var center = this._box2dBody.GetWorldCenter();
			var aabb = new ige.box2d.b2AABB();
			BOX_SIZE_HALF = 1000000;
			aabb.lowerBound.x = -BOX_SIZE_HALF;
			aabb.lowerBound.y = -BOX_SIZE_HALF;
			aabb.upperBound.x =  BOX_SIZE_HALF;
			aabb.upperBound.y =  BOX_SIZE_HALF;
			
			// Use the ECMAScript 6 set for sets of objects
			// TODO: When V8 gets iteration support, remove the array
			var bodies_seen = new Set();
			var bodies = [];

			// Add player body to seen to prevent it to be added to bodies
			bodies_seen.add(this._box2dBody);

			// Callback function for QueryAABB()
			// This is called for every fixture in the AABB
			// We want a list of unique bodies in the AABB
			var getBodies = function (fixture) {
				var body = fixture.GetBody();
				if (!bodies_seen.has(body)) {
					bodies_seen.add(body);
					bodies.push(body);
				}
				return true;
			}

			ige.box2d.world().QueryAABB(getBodies, aabb)

			
			// Attract all bodies
			// TODO: Only attract asteroids
			for (var i = 0; i < bodies.length; i++) {
				var body = bodies[i];
				var impulse = new ige.box2d.b2Vec2(0, 0);
				impulse.Subtract(body.GetWorldCenter());
				impulse.Add(this._box2dBody.GetWorldCenter());
				body.ApplyImpulse(impulse, body.GetWorldCenter());
			}

		}
		/* CEXCLUDE */

		/* For the client: */
		if (!ige.isServer) {
			/* Save the old control state for comparison later */
			oldControls = JSON.stringify(this.controls);

			/* Modify the KEYBOARD controls to reflect which keys the client currently is pushing */
			this.controls.key.up = ige.input.actionState('key.up');
			this.controls.key.down = ige.input.actionState('key.down');
			this.controls.key.left = ige.input.actionState('key.left');
			this.controls.key.right = ige.input.actionState('key.right');

			if (JSON.stringify(this.controls) !== oldControls) { //this.controls !== oldControls) {
				// Tell the server about our control change
				ige.network.send('playerControlUpdate', this.controls);
			}
		}

		// Call the BlockGrid (super-class) tick() method
		BlockGrid.prototype.tick.call(this, ctx);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Player; }
