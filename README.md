
## !! This project is WIP !! The information in this readme may also be out of date

# Overview

Like a tom-a-gotchye. Working towards a world where anyone can make a virtual pet out of anything

## Installation / Setup
```bash
npm install
npm start
```

## To build static site
```bash
npm run build
```



# Behavior Loop

## Inputs
[Time](#time) is used to to calculate [Stats](#stats), based on their rate and min/max values

[Items](#items) and [Scenes](#scenes) may directly affect [Stats](#stats), or affect the rate at which [Stats](#stats) change

[External Actions](#externalactions) trigger [Unique Events](#uniqueevents), which affect [Moods](#moods) (ex, "feelin slapped"), and [Stats](#stats) (ex, comfort +1/s) 

[Time](#time) can also trigger [External Actions](#externalactions) (ex, birthday, holidays)



## Current Status
Pets determine their [Behavior](#behaviors) by interpreting their current [Activities](#activities) and [Moods](#moods) via [Mood Swings](#moodswings) criteria

Once a [Behavior](#behaviors) is known, it can be used to render an [Animation](#animations) and drive any [Pet AI](#petai)

[Pet AI](#petai) will determine which [Activities](#activities) may happen next


## Manifest
The manifest defines which pets and (todo: scenes, items) to include.


*manifest entries for pet definitions*
```
{
  "pets":[ 
    { "id": "neenya", "url": "data/pets/neenya" },
    { "id": "hotdoug", "url": "data/pets/hot-doug" }
  ]
}
```

## Pet Definition
Each pet has a defined folder/file structure, and must be included in the [Manifest](#manifest) in order to appear.
Every pet defintion *must* contain a ./data.jsonc file in a specificed format
<img src="https://docs.google.com/drawings/d/e/2PACX-1vRRSNPSSD_AEmkX8-vqk-OmGefqYvBavgudHKB1ei4Z8T1uOWCKm-5P0V61NHcJMe6i2LSS6nxOkX8W/pub?w=1158&amp;h=673">

## Pet Behavior Flowchart
*items in faded dotted box not implemented yet*

<img src="https://docs.google.com/drawings/d/e/2PACX-1vTc_eIy9JXmXmmsghKjMFIsd6sT0125p37zkdk2KOQYZ_rxAdOQ01sf6MZcosYGUC-9Mj2nOD9_bUAh/pub?w=1158&amp;h=673">



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
Rule sets for cause and effect based on current activities, stats, and behaviors
```javascript
  {
    "when":[
      { "type":"stat", "stat":"health", "value": "<_20%" },
      { "type": "activity", "activity": "WALKING" }
    ],
    "then": "WALK_HURT"
  }
```

### When Statements
types:
* stat
  * moods *array of mood ids to check*
  * value *expression of stat value, see stat values below*
* activity
  * acitivity *id of the activity that must be active*
* status *TODO, needs refactor*


### Stat expressions in When Statements
Stat values MUST follow the syntax below. 
>"{comparison}_{value}{unit}"
* *Note the "_" in between the comparison and value*
* *the percentage unit is optional. Without it, expression will use the raw value instead*


examples:
* "<=_30%"
* "<=_30"
* "<_30"
* ">=_0.1234"

comparison | value
-----------|-------
= | exact number match
< | less than
<= | less than or equal to
> | greater than
>= | greater than or equal to


unit | value
-----------|-------
(empty) | use number value
% | use percentages

---
## behaviors

dictate an animation to play. behaviors are triggered via [Mood Swings](#mood-swings)
```javascript
  "WALK_HURT": { "animations": [ "example_walk_hurt_01", "example_walk_hurt_02" ] }
```

---
## Stats
display values and conditions for how stats are altered, and 

See more info about stats at [Delta Stats](#Delta-Stats)
```javascript
  { 
    "id":"health",
    "label":"Pet Health",
    "value": "50",
    "perSecond": "-1",
    "max": "100",
    "fullIsGood": true,
    "doesKill": true,
    "effects":[
      { "when": "<_35%", "then": "MOOD_HURT" }
    }
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