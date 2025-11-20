import sys
import scipy
import matplotlib.pyplot as plt

print("X = nb bobbleheads, Y = nb bobblehead to tap")
n = int(sys.argv[1])
if len(sys.argv) == 3:
    n2 = int(sys.argv[2])
else:
    n2 = n

k = 7
p=1/6

print(scipy.stats.binom.pmf(n=n, p=p, k=k))

dist = [scipy.stats.binom.pmf(n=i, p=p, k=k) for i in range(130)]
dist2 = []
for i, d in enumerate(dist):
    dist2.append(1-(1-d)**i)
plt.plot(dist)
plt.plot(dist2)
plt.xlabel('Nb bobblehead')
plt.ylabel('Probability to win')
plt.legend(labels=['Tapping a single bobblehead', 'Tapping all the bobbleheads'])
plt.show()

while True:
    print('Enter [X bobblehead you control] [Y bobblehead to tap]')
    n = input()
    if n == 'q':
        exit()
    if ' ' in n:
        n2, n3 = n.split(' ')
        n2 = int(n2)
        n3 = int(n3)
    else:
        n2 = int(n)
        n3 = n2
    chances_par_bbh = scipy.stats.binom.pmf(n=n2, p=p, k=k)
    print('Probability to win per tapped bobblehead :', chances_par_bbh)
    print('Probability to win by tapping everything :', 1-(1-chances_par_bbh)**n3)
