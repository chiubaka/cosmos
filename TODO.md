List of things TODO.
If this gets to long or unweildy, we'll use something else. It works for now.
Please always commit this file directly to master.
-----------------------------------------------------------------------------------------------

Things that Rafael wants to work on on his flight to NY
-----------------------------------------------
add regular ship blocks to the derilict space ships
	(ready to pull-request)
rename asteroid generator to be "random block grid generator" or something like that
	(ready to pull-request)
make asteroids actually have different types
	(ready to pull-request) (f/make-asteroids-have-different-types)
	Also do the following:
	Spread out starting asteroids over a larger area
	Beaause they are ending up on top of eachother a lot.
	Also make aseroids have fewer blocks, but maintain their current maximum size.
rename basic ship-blocks to something other than "block". They should be called ShipBlocks or something like that.
	(ready to pull-request) (r/make-BasicBlock)
	This is actually a different issue -- there needs to be a ship block type which is like "buildingBlock" or something like that
Make different blocks take different amounts of time to mine
	(ready to pull-request) (f/blocks-take-different-amounts-of-time-to-mine)
	there seems to already be a variable in the block class for this
Make it so you can't mine if you don't have a mining laser
	(ready to pull-request) (f/having-more-mining-lasers-should-increase-mining-speed)
Number of cargo blocks should govern how large a player's cargo is
	(ready to pull-request) (f/cargo-blocks-should-affect-cargo-capacity)
Edit the starter ship to have more cargo
	(ready to pull-request) (f/make-starting-ship-have-more-cargo)
	So we'll be able to hold more than two types of blocks
Don't attract blocks that you can't hold
	This might be hard to implement...
Create giant block-grids.
	Spacestations?
	Planets?
	Stars?

Major Refactoring of how Physics works (rafael)
	1st step is to make rows of blocks into fixtures. See if this works. t/ branch.

LEO-256: Players should be able to mine blocks from asteroids (Daniel/Rafael)
	LEO-257: Remove a block from the BlockGrid it is attached to when it is clicked
    LEO-258: Move a block to its own BlockGrid when it is clicked (i.e. clicking a block in a BlockGrid causes it to break-off and form its own BlockGrid)
    LEO-259: Modify the Box2D fixtures of a BlockGrid when a block is removed from it
    LEO-260: Allow player to pick up single floating blocks if they are within a certain proximity of the player's ship (rafael)

cargo hold
	list of blocks (rafael)

chat (low priority)
	there are already components for this in IGE

Minimap
	seems to be more trouble than it's worth right now
	make minimap show a stylized version of the world (low priority)

It would be really nice if Master was automatically tested (Derrick?)
	Like even just to see if the ige game server will successfully run the game.
	We can add more fancy test scripts later.

spec out the board game (Rafael)

Client-side entity interpolation (long-term)

improving streaming (long-term)
	use stream mode 2 and static IGE entities

You should be able to Zoom with the mouse. To a certain extent.

allow option for camera to track rotation as well?
