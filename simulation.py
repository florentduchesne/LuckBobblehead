import sys
import numpy as np

def lancer(n):
    arr = np.random.randint(1, 7, size=n)
    bc = np.bincount(arr, minlength=7)[1:]
    print('Résultats :', arr)
    return arr, bc

k = 7
p = 1/6

while True:
    print('Entrez [nb bobblehead] [nb bobblehead à tapper] :')
    n = input()
    if n == 'q':
        exit()
    if ' ' in n:
        n, n2 = n.split(' ')
        n = int(n)
        n2 = int(n2)
    else:
        n = int(n)
        n2 = 1
    
    arr, bc = lancer(n)
    if bc[-1] == 7:
        print('Victoire au premier lancer!')
        print(arr)
        print('Bincount :', bc)
        breakpoint()
    if n2 > 1:
        for i in range(n2 - 1):
            arr, bc2 = lancer(n)
            if bc2[-1] == 7:
                print(f'Victoire au lancer {i+1}!')
                print(arr)
                print('Bincount :', bc)
                breakpoint()
            bc += bc2
    
    print('Bincount :', bc)
    x = bc[1] + bc[3] + bc[5]
    print(x, 'trésors à créer.')
