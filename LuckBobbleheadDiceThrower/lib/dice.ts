export type ThrowResult = {
  values: number[];
  sixCount: number;
  evenCount: number;
};

export type SimulationResult = {
  dicePerThrow: number;
  throwCount: number;
  throws: ThrowResult[];
  totalEvenCount: number;
  hasWinningThrow: boolean;
  winningThrowIndexes: number[];
};

const D6_SIDES = 6;

export function simulateDiceThrows(dicePerThrow: number, throwCount: number): SimulationResult {
  const throws: ThrowResult[] = [];
  let totalEvenCount = 0;

  for (let throwIndex = 0; throwIndex < throwCount; throwIndex += 1) {
    const values: number[] = [];
    let sixCount = 0;
    let evenCount = 0;

    for (let dieIndex = 0; dieIndex < dicePerThrow; dieIndex += 1) {
      const value = rollD6();
      values.push(value);

      if (value === 6) {
        sixCount += 1;
      }

      if (value % 2 === 0) {
        evenCount += 1;
      }
    }

    totalEvenCount += evenCount;
    throws.push({ values, sixCount, evenCount });
  }

  const winningThrowIndexes = throws
    .map((result, index) => ({ result, index }))
    .filter(({ result }) => result.sixCount === 7)
    .map(({ index }) => index);

  return {
    dicePerThrow,
    throwCount,
    throws,
    totalEvenCount,
    hasWinningThrow: winningThrowIndexes.length > 0,
    winningThrowIndexes,
  };
}

export function probabilityExactlySevenSixes(dicePerThrow: number): number {
  if (dicePerThrow < 7) {
    return 0;
  }

  const combinations = binomialCoefficient(dicePerThrow, 7);
  const success = (1 / D6_SIDES) ** 7;
  const failure = (5 / D6_SIDES) ** (dicePerThrow - 7);

  return combinations * success * failure;
}

export function probabilityWinAtLeastOnce(dicePerThrow: number, throwCount: number): number {
  const oneThrowWinProbability = probabilityExactlySevenSixes(dicePerThrow);
  return 1 - (1 - oneThrowWinProbability) ** throwCount;
}

export function expectedTotalEvenResults(dicePerThrow: number, throwCount: number): number {
  return dicePerThrow * throwCount * 0.5;
}

function rollD6(): number {
  return Math.floor(Math.random() * D6_SIDES) + 1;
}

function binomialCoefficient(n: number, k: number): number {
  if (k < 0 || k > n) {
    return 0;
  }

  const reducedK = Math.min(k, n - k);
  let result = 1;

  for (let i = 1; i <= reducedK; i += 1) {
    result = (result * (n - reducedK + i)) / i;
  }

  return result;
}
