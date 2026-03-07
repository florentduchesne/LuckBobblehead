import numpy as np
import tqdm

def throw_n_dies(n):
    arr = np.random.randint(1, 7, size=n)
    bc = np.bincount(arr, minlength=7)[1:]
    return arr, bc

def simulate(actual_bbs = 2):
    print("Turn 1")
    nb_turns = 1

    arr, bc = throw_n_dies(actual_bbs) # assuming that you tap both on the first turn before combat
    print('Bincount :', bc)
    x = bc[1] + bc[3] + bc[5] # number of tapped treasures created
    print(x, 'treasures to create')
    nb_tokens_per_turn = 1 + x
    actual_bbs += nb_tokens_per_turn
    print("end of turn", actual_bbs, "bbs")

    if bc[-1] == 7: # win first turn
        return 1

    while bc[-1] != 7:
        actual_bbs = min(42, actual_bbs + 1 + x) # you wont create more than 42 bobbleheads
        for i in range(actual_bbs): # assuming that you tap all of them, which is unlikely when you have 20+ with only your lands, but at this point you have a high change of winning anyway.
            # also, once you've reach a certain number of bobbleheads, you can tap the treasures you created next turn to pay the mana to tap them bbs.
            arr, bc = throw_n_dies(actual_bbs)
            if bc[-1] == 7:
                break
            else:
                x += bc[1] + bc[3] + bc[5]
        print('Bincount :', bc)
        x = bc[1] + bc[3] + bc[5]
        print(x, 'treasures to create')
        nb_turns += 1
        print(f"Turn {nb_turns}")
        
    print("You won in", nb_turns, "turns!")
    print('Bincount :', bc)
    return nb_turns

all_nb_turns = []
for i in tqdm.tqdm(range(10000)):
    all_nb_turns.append(simulate())

print(sum(all_nb_turns) / len(all_nb_turns)) # ~= 5.1
    