var Player = BlockGrid.extend({
	classId: 'Player',

	init: function () {
		BlockGrid.prototype.init.call(this);

		var self = this;

		this.drawBounds(false);

		// Rotate to point upwards
		this.controls = {
			left: false,
			right: false,
			thrust: false
		};
		this.width(20);
		this.height(20);
		this.translateTo(100, 100, 0);

		if (!ige.isServer) {
			this.depth(1);
		}

		this.setGrid([[new PowerBlock(), new EngineBlock()]]);

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
		if (ige.isServer) {

			// This determines how fast you can rotate your spaceship
            var angularImpulse = -10;

			if (this.controls.left) {
				this._box2dBody.ApplyTorque(angularImpulse);
			}
			if (this.controls.right) {
				this._box2dBody.ApplyTorque(-angularImpulse);
			}

			// TODO: Make spaceship go backwards
			if (this.controls.thrust) {
				var vel = this._box2dBody.GetLinearVelocity();
				var angle = this._box2dBody.GetAngle();
				var x_comp = Math.cos(angle);
				var y_comp = Math.sin(angle);
				var impulse = new ige.box2d.b2Vec2(x_comp, y_comp);
				var location = this._box2dBody.GetWorldCenter();

				this._box2dBody.ApplyImpulse(impulse, location);
			} else {
				//this.velocity.x(0);
				//this.velocity.y(0);
			}
		}
		/* CEXCLUDE */

		if (!ige.isServer) {
			if (ige.input.actionState('left')) {
				if (!this.controls.left) {
					// Record the new state
					this.controls.left = true;

					// Tell the server about our control change
					ige.network.send('playerControlLeftDown');
				}
			} else {
				if (this.controls.left) {
					// Record the new state
					this.controls.left = false;

					// Tell the server about our control change
					ige.network.send('playerControlLeftUp');
				}
			}

			if (ige.input.actionState('right')) {
				if (!this.controls.right) {
					// Record the new state
					this.controls.right = true;

					// Tell the server about our control change
					ige.network.send('playerControlRightDown');
				}
			} else {
				if (this.controls.right) {
					// Record the new state
					this.controls.right = false;

					// Tell the server about our control change
					ige.network.send('playerControlRightUp');
				}
			}

			if (ige.input.actionState('thrust')) {
				if (!this.controls.thrust) {
					// Record the new state
					this.controls.thrust = true;

					// Tell the server about our control change
					ige.network.send('playerControlThrustDown');
				}
			} else {
				if (this.controls.thrust) {
					// Record the new state
					this.controls.thrust = false;

					// Tell the server about our control change
					ige.network.send('playerControlThrustUp');
				}
			}
		}

		// Call the IgeEntity (super-class) tick() method
		IgeEntity.prototype.tick.call(this, ctx);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Player; }
