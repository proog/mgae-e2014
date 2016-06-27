Monospace Hero
==========

![gameplay_death_sample](https://permortensen.com/content/images/2015/01/gameplay_death_sample.png)

Monospace Hero is a 2D platform game where everything in the level is represented by a textual symbol, including the player.

It has no built-in levels but can parse a text file or the contents of a text box into levels for the game, meaning that your text editor is your level editor. It's a bit like running around in your .txt files! The best way to explain it is to demonstrate it, so [click here to try it out](https://permortensen.com/downloads/monospacehero/).

Monospace Hero was written by Jacob Rasmussen and myself in the course of a few weeks for a project in the game engines course at the IT University.

## Gameplay

Move around with left and right arrow keys. Jump with space. That's it.

Your goal is to get to any  of the symbols designated as goals and optionally pick up all collectible symbols. Touching enemy or danger symbols kills you.

## Basics of level building

A Monospace Hero text file is always structured like this:

1. Mapping of symbols to predefined roles in JSON format
2. Level start marker (BEGINLEVEL)
3. Level layout
4. Items 2 and 3 an arbitrary number of times to add more levels

See the sample game in the text box for an example. The available roles are:

- *player* (exactly one per level required)
- *enemy* (enemy with basic AI)
- *obstacle* (solid object, like platforms)
- *danger* (solid object that kills the player)
- *passive* (non-solid object, like clouds)
- *collectible* (non-solid object increasing the score)
- *goal* (completes the level when reached)

## Technical details

Monospace Hero is written in JavaScript and uses [the Gamvas engine](https://www.93i.de/products/software/gamvas) with Box2D integration as its foundation. Because of this, it does not require installation or a web server and can be run locally on any machine with a recent web browser. Simply clone the repository and open index.html.

From our experience, Monospace Hero works in the newest versions of Chrome, Firefox, Internet Explorer and Safari, with Chrome performing slightly better than the rest.
