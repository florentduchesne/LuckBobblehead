# Luck Bobblehead

Some simple scripts to calculate the outcome of playing a bunch of luck bobbleheads.

`simulation.py` will simulate rolls and give the number of treasures to create (to save some time when playing).
`luck.py` will display a graph of the chances to win depending on the number of bobbleheads you control by tapping one of them or all of them. It will also give the probability to win by tapping X luck bobbleheads while controlling Y bobbleheads.
`test.py` aims at estimating the number of turns it takes to win a game, starting with the non-token luck bobblehead, a token copy of it, and brudiclad in play, creating a token per turn. It tends to 5.13 turns.
