import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useDiceSettings } from '@/contexts/dice-settings-context';
import {
  expectedTotalEvenResults,
  probabilityExactlySevenSixes,
  probabilityWinAtLeastOnce,
} from '@/lib/dice';

export default function StatsScreen() {
  const { dicePerThrowInput, throwCountInput, setDicePerThrowInput, setThrowCountInput } =
    useDiceSettings();

  const stats = useMemo(() => {
    const dicePerThrow = parsePositiveInt(dicePerThrowInput);
    const throwCount = parsePositiveInt(throwCountInput);

    if (!dicePerThrow || !throwCount) {
      return null;
    }

    const oneThrowWin = probabilityExactlySevenSixes(dicePerThrow);
    const matchWin = probabilityWinAtLeastOnce(dicePerThrow, throwCount);
    const expectedEven = expectedTotalEvenResults(dicePerThrow, throwCount);

    return {
      dicePerThrow,
      throwCount,
      oneThrowWin,
      matchWin,
      expectedEven,
    };
  }, [dicePerThrowInput, throwCountInput]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Statistiques</ThemedText>
        <ThemedText>
          Cette page affiche les probabilités théoriques selon X (dés par lancer) et N (nombre de
          lancers).
        </ThemedText>

        <View style={styles.inputRow}>
          <View style={styles.inputBlock}>
            <ThemedText type="defaultSemiBold">X (dés par lancer)</ThemedText>
            <TextInput
              keyboardType="number-pad"
              value={dicePerThrowInput}
              onChangeText={setDicePerThrowInput}
              style={styles.input}
            />
          </View>
          <View style={styles.inputBlock}>
            <ThemedText type="defaultSemiBold">N (nombre de lancers)</ThemedText>
            <TextInput
              keyboardType="number-pad"
              value={throwCountInput}
              onChangeText={setThrowCountInput}
              style={styles.input}
            />
          </View>
        </View>

        {stats ? (
          <View style={styles.statCard}>
            <ThemedText type="subtitle">Résultats théoriques</ThemedText>
            <ThemedText>
              P(avoir exactement 7 six sur un lancer) :{' '}
              <ThemedText type="defaultSemiBold">{toPercent(stats.oneThrowWin)}</ThemedText>
            </ThemedText>
            <ThemedText>
              P(gagner au moins une fois en N lancers) :{' '}
              <ThemedText type="defaultSemiBold">{toPercent(stats.matchWin)}</ThemedText>
            </ThemedText>
            <ThemedText>
              Espérance de Y (total de résultats pairs) :{' '}
              <ThemedText type="defaultSemiBold">{stats.expectedEven.toFixed(2)}</ThemedText>
            </ThemedText>
          </View>
        ) : (
          <ThemedText>Entrez des entiers positifs pour afficher les statistiques.</ThemedText>
        )}
      </ThemedView>
    </ScrollView>
  );
}

function parsePositiveInt(value: string): number | null {
  if (!/^\d+$/.test(value.trim())) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);

  if (parsed <= 0) {
    return null;
  }

  return parsed;
}

function toPercent(value: number): string {
  return `${(value * 100).toFixed(6)} %`;
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
  },
  container: {
    gap: 14,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputBlock: {
    flex: 1,
    gap: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#7f7f7f',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111',
    backgroundColor: '#fff',
  },
  statCard: {
    borderWidth: 1,
    borderColor: '#d2d2d2',
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
});
