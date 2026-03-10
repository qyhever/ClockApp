import { Audio } from 'expo-av';

let alarmSound: Audio.Sound | null = null;

export async function playAlarmSound(): Promise<void> {
  await stopAlarmSound();
  const { sound } = await Audio.Sound.createAsync(
    require('../assets/radar.aac'),
    { shouldPlay: true, isLooping: true }
  );
  alarmSound = sound;
}

export async function stopAlarmSound(): Promise<void> {
  if (alarmSound) {
    await alarmSound.stopAsync();
    await alarmSound.unloadAsync();
    alarmSound = null;
  }
}
