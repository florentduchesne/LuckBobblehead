import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useDiceSettings } from '@/contexts/dice-settings-context';
import { SimulationResult, simulateDiceThrows } from '@/lib/dice';

const MAX_INPUT_VALUE = 10000;

export default function HomeScreen() {
  const { dicePerThrowInput, throwCountInput, setDicePerThrowInput, setThrowCountInput } =
    useDiceSettings();
  const [result, setResult] = useState<SimulationResult | null>(null);

  const parsedInputs = useMemo(() => {
    const dicePerThrow = parsePositiveInt(dicePerThrowInput);
    const throwCount = parsePositiveInt(throwCountInput);

    return { dicePerThrow, throwCount };
  }, [dicePerThrowInput, throwCountInput]);

  const launchSimulation = () => {
    const { dicePerThrow, throwCount } = parsedInputs;

    if (!dicePerThrow || !throwCount) {
      Alert.alert('Valeurs invalides', 'Entrez des nombres entiers positifs pour X et N.');
      return;
    }

    if (dicePerThrow > MAX_INPUT_VALUE || throwCount > MAX_INPUT_VALUE) {
      Alert.alert('Valeurs trop grandes', `X et N doivent être inférieurs à ${MAX_INPUT_VALUE}.`);
      return;
    }

    const simulation = simulateDiceThrows(dicePerThrow, throwCount);
    setResult(simulation);

    if (simulation.hasWinningThrow) {
      const winningTurns = simulation.winningThrowIndexes.map((index) => index + 1).join(', ');
      Alert.alert(
        'Victoire',
        `Exactement 7 dés affichent 6 au(x) lancer(s) : ${winningTurns}. Vous gagnez la partie.`
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Compteur de dés</ThemedText>
        <ThemedText>
          Paramétrez X dés à 6 faces, puis lancez-les N fois. Si un lancer contient exactement 7
          fois le chiffre 6, la partie est gagnée.
        </ThemedText>

        <View style={styles.inputRow}>
          <View style={styles.inputBlock}>
            <ThemedText type="defaultSemiBold">X (dés par lancer)</ThemedText>
            <TextInput
              keyboardType="number-pad"
              value={dicePerThrowInput}
              onChangeText={setDicePerThrowInput}
              style={styles.input}
              placeholder="Ex: 20"
              placeholderTextColor="#7f7f7f"
            />
          </View>
          <View style={styles.inputBlock}>
            <ThemedText type="defaultSemiBold">N (nombre de lancers)</ThemedText>
            <TextInput
              keyboardType="number-pad"
              value={throwCountInput}
              onChangeText={setThrowCountInput}
              style={styles.input}
              placeholder="Ex: 5"
              placeholderTextColor="#7f7f7f"
            />
          </View>
        </View>

        <Pressable style={styles.primaryButton} onPress={launchSimulation}>
          <ThemedText type="defaultSemiBold" style={styles.primaryButtonText}>
            Lancer
          </ThemedText>
        </Pressable>

        {result ? (
          <View style={styles.resultsSection}>
            <ThemedText type="subtitle">Résultats</ThemedText>
            <ThemedText>
              Y (nombre total de résultats pairs) :{' '}
              <ThemedText type="defaultSemiBold">{result.totalEvenCount}</ThemedText>
            </ThemedText>
            <ThemedText>
              État :{' '}
              <ThemedText type="defaultSemiBold">
                {result.hasWinningThrow ? 'Victoire' : 'Pas de victoire'}
              </ThemedText>
            </ThemedText>

            {result.throws.map((throwResult, index) => (
              <View key={`throw-${index}`} style={styles.throwCard}>
                <ThemedText type="defaultSemiBold">Lancer {index + 1}</ThemedText>
                <ThemedText>Dés : {throwResult.values.join(' - ')}</ThemedText>
                <ThemedText>Nombre de 6 : {throwResult.sixCount}</ThemedText>
                <ThemedText>Résultats pairs : {throwResult.evenCount}</ThemedText>
              </View>
            ))}
          </View>
        ) : null}
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
  primaryButton: {
    backgroundColor: '#1271ff',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: '#fff',
  },
  resultsSection: {
    marginTop: 8,
    gap: 10,
  },
  throwCard: {
    borderWidth: 1,
    borderColor: '#d2d2d2',
    borderRadius: 10,
    padding: 10,
    gap: 4,
  },
});
