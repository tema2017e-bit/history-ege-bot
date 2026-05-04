// Простая утилита звуковых эффектов через Web Audio API

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        return null;
      }
    }
    return this.audioContext;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }

  // Правильный ответ — приятный восходящий звук
  correct() {
    this.playTone(523.25, 0.1, 'sine', 0.2); // C5
    setTimeout(() => this.playTone(659.25, 0.1, 'sine', 0.2), 80); // E5
    setTimeout(() => this.playTone(783.99, 0.15, 'sine', 0.2), 160); // G5
  }

  // Неправильный ответ — низкий нисходящий
  incorrect() {
    this.playTone(300, 0.2, 'square', 0.15);
    setTimeout(() => this.playTone(200, 0.3, 'square', 0.1), 100);
  }

  // Клик — короткий
  click() {
    this.playTone(800, 0.05, 'sine', 0.1);
  }

  // Урок завершён — праздничная мелодия
  lessonComplete() {
    const notes = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.15, 'sine', 0.15), i * 100);
    });
  }

  // Потеря сердца
  loseHeart() {
    this.playTone(400, 0.15, 'triangle', 0.2);
    setTimeout(() => this.playTone(300, 0.2, 'triangle', 0.15), 150);
  }

  // Достижение
  achievement() {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.2, 'sine', 0.15), i * 120);
    });
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
}

export const soundManager = new SoundManager();
