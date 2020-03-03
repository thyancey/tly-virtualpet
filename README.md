# tly-virtualpet
> This project is WIP

Like a tom-a-gotchye. Working towards a world where anyone can make a virtual pet out of anything



# Pet Behavior
Pets determine their **Behavior** by interpreting their current [Activities](#Activities) and [Mood Swing](#Mood-Swings) criteria

Once a **Behavior** is known, it can be used to look up a [Status](#Status) and get an [Animation](#Animation)

**Behaviors** also may restrict other [Activities](#Activities) from occuring


[Statuses](#Status) and **Behaviors** Are almost the same, however the difference is that a [Status](#Status) is a definition what should happen, where as a **Behavior** represents the current state of what is happening.


# Pet Architecture

## Taxonomy
Pets have a 2 level taxonomy of Type > Pet
```javascript
[
  "wildlife":[
    "petId_1",
    "petId_2"
  ],
  "toys":[
    "toy_1"
  ]
]
```
---
## Activities
WALKING, JUMPING, EATING

*note: Activities are controlled by the framework at the moment and are not customizeable*

---

## Mood Swings
Rule sets for cause and effect based on current activities, stats, and statuses
```javascript
  {
    "when":[
      { "type":"stat", "stat":"health", "value": "<_20%" },
      { "type": "activity", "activity": "WALKING" }
    ],
    "then": "WALK_HURT"
  }
```
---
## Statuses

dictate an animation to play. Statuses are triggered via [Mood Swings](#Mood-Swings)
```javascript
  "WALK_HURT": { "animations": [ "example_walk_hurt_01", "example_walk_hurt_02" ] }
```

---
## Stats
display values and conditions for how stats are altered, and 
(TODO, remove?) how they affect the pet

See more info about stats at [Delta Stats](#Delta-Stats)
```javascript
  { 
    "id":"health",
    "label":"Pet Health",
    "value": "50",
    "perSecond": "-1",
    "max": "100",
    "fullIsGood": true,
    "doesKill": true
  }
```

Stats can have the following properties:
* id *--required, must be unique*
* label *--optional, for display purposes*
* value *--required, initial value of the stat (for a new pet, etc), 
* perSecond *--required, amount the stat changes per second*
* max *--required, max the stat can be*
* fullIsGood *--optional, default is true. If true, it is considered beneficial when the value of the stat grows*
* doesKill *--optional, default is false. If true, if this stat hits 0 or the max (depending on fullIsGood value), the pet will die*

Additional Notes
* **value**, **perSecond**, and **max** can be a positive or negative number with decimals, but must be cast as a string in the JSON
* Stats have no "min", the minimum value is always 0

---

## Animations
```javascript
  "example_walk_hurt_01":{
    "sprite": "Example_Walk", //- which Sprite to use
    "speed": "50",  //- TODO, this is real janky, right now higher is slower. Needs to be reworked.
    "frames": [ 3, 4, 5 ] //- explicit spritesheet cells to play, in order
  }
```

---
## Sprites
```javascript
  "Example_Walk":{
    "type": "Sprite_Animated", //- other types to document later
    "imageUrl": "./pets/example-walk.png", //- main sprite sheet image, can be jpg, gif, or png
    "overlayUrl": "./pets/example-walk-overlay.png", //- optional overlay sprite sheet image, must be able to sit on imageUrl like a transparency, you dont want to use anything other than a png or gif with transparency
    "spriteInfo":{
      "scale": 1, //- scale boost to the sprite, 1 is normal
      "orientation": -1, //- direction character is facing: -1: left, 1: right
      "faceDirection": true, //- sprite flips horizontally when moving left and right
      "grid": [ 6, 4 ],  //- number of [ columns, rows ] of the spritesheet
      "cells": [ 400, 533 ] //- [ width, height ] of the spritesheet cells
    }
  },
```

---


## Delta Stats
Realtime values of stats ("Delta Stats") are calcuated by comparing the current time to the last time stats were saved. This allows the game to "continue in the background".

At the moment, values changes are simple and linear, so they can be calculated easily using the pseudocode formula below

```javascript
  currentStat = savedValue + (secondsElapsed * statPerSecond);
```

stats are saved often (when manually changed by the user, when the page is quit/reloaded)

Because of this, the webapp relies on a cookie named ***tly_virtualpet*** to store information. The app does not use any other forms of login or data storage at the moment.