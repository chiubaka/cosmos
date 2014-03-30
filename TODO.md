List of things TODO.
If this gets to long or unweildy, we'll use something else. It works for now.
Please always commit this file directly to master.
-----------------------------------------------------------------------------------------------
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
	push this feature branch (rafael)

Minimap (rafael)
	make minimap show a stylized version of the world (low priority)

It would be really nice if Master was automatically tested (Derrick?)
	Like even just to see if the ige game server will successfully run the game.
	We can add more fancy test scripts later.

Element blocks
	review ice pull request (Daniel)

Asteroid generator (rafael)
	blocks in the asteroid should be adjacent to other blocks, esp. of similar type

spec out the board game (Rafael)

Client-side entity interpolation (long-term)

improving streaming (long-term)
	use stream mode 2 and static IGE entities

refactor code to be consistent with IGE's getters and setters. This should be in an r/ branch.

you should be able to move backwards (Rafael)

make many asteroids (that don't overlap)
	submit pull request (rafael)

merge the approved pull request (Rafael)
