const { useState, useEffect, useRef } = React;
const e = React.createElement;

// Simple Sound Engine (Web Audio API)
const playSound = (type) => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  if (type === 'match') {
    osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } else if (type === 'miss') {
    osc.frequency.setValueAtTime(220, ctx.currentTime); // Low buzz
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }
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

    // Med Spawner
    gameLoopRef.current = setInterval(() => {
      const names = Object.keys(MED_SIDE_EFFECTS);
      const randomName = names[Math.floor(Math.random() * names.length)];
      setFallingMeds(prev => [...prev, {
        id: medIdCounter.current++,
        name: randomName,
        top: -10,
        left: Math.random() * 70 + 15,
        speed: config.speed
      }]);
    }, config.spawnRate);

    // Movement Engine
    const moveInterval = setInterval(() => {
      setFallingMeds(prev => {
        let hitBottom = false;
        const updated = prev.map(m => {
          const newTop = m.top + m.speed;
          if (newTop > 85) hitBottom = true;
          return { ...m, top: newTop };
        });

        if (hitBottom) {
          playSound('miss');
          setLives(l => l - 1);
          return updated.filter(m => m.top <= 85);
        }
        return updated;
      });
    }, 50);

    return () => {
      clearInterval(gameLoopRef.current);
      clearInterval(moveInterval);
    };
  }, [gameState]);

  // Handle Game Over
  useEffect(() => {
    if (lives <= 0 && gameState === 'playing') {
      setGameState('gameOver');
    }
  }, [lives]);

  const handleMatch = (effect) => {
    if (fallingMeds.length === 0) return;
    const targetMed = fallingMeds[0];
    if (MED_SIDE_EFFECTS[targetMed.name].includes(effect)) {
      playSound('match');
      setScore(s => s + 10);
      setFallingMeds(prev => prev.slice(1));
    } else {
      playSound('miss');
      setScore(s => Math.max(0, s - 5)); // Small penalty
    }
  };

  if (gameState === 'menu') {
    return e('div', {className: 'flex flex-col items-center justify-center h-screen bg-white p-6 text-center'},
      e('h1', {className: 'text-6xl font-bold text-slate-900 mb-2'}, 'ToxicMatch'),
      e('p', {className: 'text-slate-500 italic mb-12'}, 'Clinical Toxicity Practice'),
      e('div', {className: 'space-y-4 w-full max-w-xs'},
        Object.keys(DIFFICULTY_LEVELS).map(d => 
          e('button', {
            key: d,
            onClick: () => { setDifficulty(d); setGameState('playing'); },
            className: 'w-full py-4 border-2 border-slate-900 font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all'
          }, `${d} (${DIFFICULTY_LEVELS[d].lives} Lives)`)
        )
      )
    );
  }

  if (gameState === 'gameOver') {
    return e('div', {className: 'flex flex-col items-center justify-center h-screen'},
      e('h2', {className: 'text-4xl font-bold mb-4'}, 'WARD OVERLOADED'),
      e('p', {className: 'text-2xl mb-8 font-serif'}, `Final Score: ${score}`),
      e('button', {
        onClick: () => location.reload(),
        className: 'bg-slate-900 text-white px-12 py-4 rounded-full font-bold'
      }, 'RESTART SHIFT')
    );
  }

  return e('div', {className: 'h-screen flex flex-col bg-slate-50'},
    // Status Bar
    e('div', {className: 'p-4 bg-white border-b flex justify-between items-center shadow-sm'},
      e('div', {className: 'flex flex-col'},
        e('span', {className: 'text-xs uppercase text-slate-400 font-bold'}, 'Rotation'),
        e('span', {className: 'font-bold text-slate-800'}, config.name)
      ),
      e('div', {className: 'text-3xl font-bold'}, score),
      e('div', {className: 'flex flex-col items-end'},
        e('span', {className: 'text-xs uppercase text-slate-400 font-bold'}, 'Vital Signs'),
        e('span', {className: 'text-red-600 font-bold'}, '❤️ '.repeat(lives))
      )
    ),

    // Play Field
    e('div', {className: 'flex-grow relative overflow-hidden'},
      fallingMeds.map(m => 
        e('div', {
          key: m.id,
          style: { top: `${m.top}%`, left: `${m.left}%`, position: 'absolute', transform: 'translateX(-50%)' },
          className: 'bg-white border-2 border-slate-900 px-6 py-3 shadow-xl font-bold text-lg'
        }, m.name)
      )
    ),

    // Dashboard (The Fixed Grid)
    e('div', {className: 'p-2 bg-slate-100 border-t space-y-2'},
      Object.entries(SIDE_EFFECT_GROUPS).map(([groupName, effects]) => 
        e('div', {key: groupName, className: 'flex flex-col'},
          e('span', {className: 'text-[9px] uppercase font-bold text-slate-400 px-1'}, groupName),
          e('div', {className: 'grid grid-cols-4 gap-1'},
            effects.map(eff => 
              e('button', {
                key: eff,
                onClick: () => handleMatch(eff),
                className: 'bg-white border border-slate-300 py-2 text-[10px] font-bold leading-tight hover:bg-slate-900 hover:text-white active:bg-blue-500 transition-colors rounded'
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
