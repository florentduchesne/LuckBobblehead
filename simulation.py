import numpy as np

def throw(n):
    arr = np.random.randint(1, 7, size=n)
    bc = np.bincount(arr, minlength=7)[1:]
    print('Results :', arr)
    return arr, bc

k = 7
p = 1/6

while True:
    print('Enter [n bobblehead] [nb bobblehead to tap] :')
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
    
    arr, bc = throw(n)
    if bc[-1] == 7:
        print('Win at first throw!')
        print(arr)
        print('Bincount :', bc)
        exit()
    if n2 > 1:
        for i in range(n2 - 1):
            arr, bc2 = lancer(n)
            if bc2[-1] == 7:
                print(f'Win at {i+1}nth throw!')
                print(arr)
                print('Bincount :', bc)
                exit()
            bc += bc2
    
    print('Bincount :', bc)
    x = bc[1] + bc[3] + bc[5]
    print(x, 'treasures to create.')
