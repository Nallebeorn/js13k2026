# TODO
* Allow selectively marking clouds as safe/unsafe (or remove unsafe clouds from level)
* Remove colors from unicorn when using up grinds
* Don't freeze player during death wipe
* Make boost state clear when grinding
* Delayed rainbow grinder creation
* Shard collection effect
* Separate meta-object and intra-object indices. Use to discard depth outlines
  and surface outlines at a distance
* More precise horn collision
* Drop shadow or equivalent
* Coyote jump
* NPC collision? (dynamic solid colliders)
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

* ArrayBuffer+DataView:: 6KB 702B
* Uint8Array refactor: 6KB 682B
