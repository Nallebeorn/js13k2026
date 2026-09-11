# TODO
* Coyote jump also from rainbow
* Move shard 2 floor further away + give you more space to gallop-up
* Camera collision against level
* Delayed rainbow grinder creation
* Make boost state clear when grinding
* Speedrun timers
* SFX
* Faster deaths (higher max vy, raise death plane)
* Grinding particle FX
* Boost gallop VFX
* Shard collection particle FX
* Separate meta-object and intra-object indices. Use to discard depth outlines
  and surface outlines at a distance. Could just bake into same int (meta objects increment by 1000)
	* Depth Fix would require separate index though, that always increments. Or maybe that could be baked in too in some clever way?
* More precise horn collision
* Drop shadow or equivalent
* Gamepad input
* Animate balloons (but only when in air?)
* Arrow keys as alternative to WASD
* Put shard positions in level data
* NPC collision? (dynamic solid colliders)
* New color for boxes and walls
* Sun
* 
* ~Shards that run away~
* ~Replace first drill jump pillars with wall~
* ~Add momentum preservation to first shard level (and balloon)~
* ~Spikes or similar to make top of walls unwalkable?~
	* ~Could perhaps be merged with the bounce balloons?~
* ~Amanda mouse issue~
* ~Bend rainbow sideways (for visibility)~
* ~Coyote jump~
* ~Don't save when touching clouds when not standing on them~
* ~Shard collection effect~
* ~Remove colors from unicorn when using up grinds~
* ~Don't freeze player during death wipe~
* ~Allow selectively marking clouds as safe/unsafe (or remove unsafe clouds from level)~
* ~Screen wipes (for respawn and shard collection)~
* ~Handle high velocity collisions (especially vertical) by stepping~
* ~I think we're out of object indices...~
* ~NPC *max* shrds (in addition to min)~

# Stats
* Pre-binary level format: 5KB 339B
* Src-format level data: 97B
* Bin-format level data: 28B
* Post-binary level format: 5KB 328B

* Pre binary palette: 5KB 335B
* Post binary palette: 5KB 299B

* Pre hardcoded sections: 5KB 299B
* Post hardcoded sections: 5KB 278B

* Pre-shards in level data: 7KB 28B
* Post-shards in level data: 7KB 28B :D
