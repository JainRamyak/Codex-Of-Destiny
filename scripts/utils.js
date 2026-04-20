class GameUtils {
  constructor() {
    this.audioCtx = null;
  }

  initAudio() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playTone(frequency, duration, type = 'square', startTimeOffset = 0, endFrequency = null) {
    if (!this.audioCtx) return;
    const oscillator = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();
    
    oscillator.type = type;
    
    const startTime = this.audioCtx.currentTime + startTimeOffset;
    oscillator.frequency.setValueAtTime(frequency, startTime);
    if (endFrequency) {
      oscillator.frequency.exponentialRampToValueAtTime(endFrequency, startTime + duration);
    }

    gainNode.gain.setValueAtTime(0.1, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }

  playSound(name) {
    this.initAudio();
    
    // Notes for fanfare: C4, E4, G4, C5
    const C4 = 261.63;
    const E4 = 329.63;
    const G4 = 392.00;
    const C5 = 523.25;

    switch (name) {
      case 'click':
        // Button click → short high beep (440hz, 0.1s)
        this.playTone(440, 0.1, 'square');
        break;
      case 'correct':
        // Correct answer → ascending 3 notes (C-E-G, 0.15s each)
        this.playTone(C4, 0.15, 'square', 0);
        this.playTone(E4, 0.15, 'square', 0.15);
        this.playTone(G4, 0.15, 'square', 0.30);
        break;
      case 'wrong':
        // Wrong answer → descending buzz (300hz→150hz, 0.3s)
        this.playTone(300, 0.3, 'sawtooth', 0, 150);
        break;
      case 'levelup':
        // Level up → 5 note fanfare (C-E-G-E-C high, 0.2s each)
        this.playTone(C4, 0.2, 'square', 0);
        this.playTone(E4, 0.2, 'square', 0.2);
        this.playTone(G4, 0.2, 'square', 0.4);
        this.playTone(E4, 0.2, 'square', 0.6);
        this.playTone(C5, 0.4, 'square', 0.8);
        break;
      case 'xp':
        // XP gain → quick ascending sweep
        this.playTone(400, 0.2, 'sine', 0, 800);
        break;
    }
  }

  typeWriter(text, elementId, speed = 50, callback) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.innerHTML = '';
    let i = 0;
    
    const type = () => {
      if (i < text.length) {
        el.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else if (callback) {
        callback();
      }
    };
    
    type();
  }
  
  async loadComponent(id, path) {
    try {
      const response = await fetch(path);
      const text = await response.text();
      const el = document.getElementById(id);
      if(el) {
        el.innerHTML = text;
      }
    } catch(err) {
      console.error('Error loading component:', path, err);
    }
  }
}

// Make globally available
window.GameUtils = GameUtils;
