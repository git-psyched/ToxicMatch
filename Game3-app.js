const { useState, useEffect, useRef } = React;
const e = React.createElement;

// AUDIO ENGINE
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const playTone = (freq, type, duration) => {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

function ToxicMatch() {
  const [gameState, setGameState] = useState('menu'); 
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [fallingMeds, setFallingMeds] = useState([]);
  const [difficulty, setDifficulty] = useState('medium');
  const gameLoopRef = useRef(null);
  const medIdCounter = useRef(0);

  const config = DIFFICULTY_LEVELS[difficulty];

  useEffect(() => {
    if (gameState !== 'playing') return;
    setLives(config.lives);
    setScore(0);
    setFallingMeds([]);

    gameLoopRef.current = setInterval(() => {
      const names = Object.keys(MED_SIDE_EFFECTS);
      const randomName = names[Math.floor(Math.random() * names.length)];
      setFallingMeds(prev => [...prev, {
        id: medIdCounter.current++,
        name: randomName,
        top: -10,
        left: Math.random() * 60 + 20,
        speed: config.speed
      }]);
    }, config.spawnRate);

    const moveInterval = setInterval(() => {
      setFallingMeds(prev => {
        let missed = false;
        const updated = prev.map(m => ({ ...m, top: m.top + m.speed }));
        const filtered = updated.filter(m => {
          if (m.top > 88) { missed = true; return false; }
          return true;
        });
        if (missed) {
          playTone(150, 'sawtooth', 0.4); // Buzz sound
          setLives(l => l - 1);
        }
        return filtered;
      });
    }, 50);

    return () => { clearInterval(gameLoopRef.current); clearInterval(moveInterval); };
  }, [gameState]);

  useEffect(() => {
    if (lives <= 0 && gameState === 'playing') setGameState('gameOver');
  }, [lives]);

  const handleMatch = (effect) => {
    if (fallingMeds.length === 0) return;
    const targetMed = fallingMeds[0];
    if (MED_SIDE_EFFECTS[targetMed.name].includes(effect)) {
      playTone(880, 'sine', 0.1); // Ding sound
      setScore(s => s + 10);
      setFallingMeds(prev => prev.slice(1));
    } else {
      playTone(200, 'triangle', 0.2); // Error sound
    }
  };

  if (gameState === 'menu') {
    return e('div', {className: 'flex flex-col items-center justify-center h-screen bg-white p-6'},
      e('h1', {className: 'text-6xl font-bold text-slate-900 mb-8'}, 'ToxicMatch'),
      e('div', {className: 'space-y-4 w-64'},
        Object.keys(DIFFICULTY_LEVELS).map(d => 
          e('button', {
            key: d,
            onClick: () => { setDifficulty(d); setGameState('playing'); if(audioCtx.state === 'suspended') audioCtx.resume(); },
            className: 'w-full py-4 border-2 border-slate-900 font-bold uppercase hover:bg-slate-900 hover:text-white transition-all'
          }, `${d} (${DIFFICULTY_LEVELS[d].lives} Lives)`)
        )
      )
    );
  }

  if (gameState === 'gameOver') {
    return e('div', {className: 'flex flex-col items-center justify-center h-screen'},
      e('h2', {className: 'text-4xl font-bold mb-4 font-serif uppercase'}, 'Ward Overloaded'),
      e('p', {className: 'text-2xl mb-8 font-serif'}, `Final Score: ${score}`),
      e('button', { onClick: () => setGameState('menu'), className: 'bg-slate-900 text-white px-12 py-4 rounded-full font-bold' }, 'RESTART')
    );
  }

  return e('div', {className: 'h-screen flex flex-col bg-slate-50'},
    e('div', {className: 'p-4 bg-white border-b flex justify-between items-center shadow-sm'},
      e('span', {className: 'font-bold text-slate-800'}, config.name),
      e('span', {className: 'text-2xl font-bold'}, score),
      e('span', {className: 'text-red-600 font-bold'}, '❤️ '.repeat(lives))
    ),
    e('div', {className: 'flex-grow relative overflow-hidden'},
      fallingMeds.map(m => 
        e('div', {
          key: m.id,
          style: { top: `${m.top}%`, left: `${m.left}%`, position: 'absolute', transform: 'translateX(-50%)' },
          className: 'bg-white border-2 border-slate-900 px-4 py-2 shadow-xl font-bold text-lg falling-pill'
        }, m.name)
      )
    ),
    // FIXED DASHBOARD - Categorized
    e('div', {className: 'p-2 bg-slate-200 border-t grid gap-2'},
      Object.entries(SIDE_EFFECT_GROUPS).map(([group, effects]) => 
        e('div', {key: group},
          e('p', {className: 'text-[10px] uppercase font-bold text-slate-500 mb-1'}, group),
          e('div', {className: 'grid grid-cols-4 gap-1'},
            effects.map(eff => 
              e('button', {
                key: eff,
                onClick: () => handleMatch(eff),
                className: 'bg-white border border-slate-300 py-3 text-[10px] font-bold leading-none hover:bg-slate-800 hover:text-white rounded active:scale-95 transition-all'
              }, eff)
            )
          )
        )
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e(ToxicMatch));
