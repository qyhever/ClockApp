import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alarm } from '../types/alarm';

const ALARMS_KEY = '@alarms';

export async function loadAlarms(): Promise<Alarm[]> {
  const data = await AsyncStorage.getItem(ALARMS_KEY);
  if (!data) return [];
  return JSON.parse(data);
}

export async function saveAlarms(alarms: Alarm[]): Promise<void> {
  await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(alarms));
}
