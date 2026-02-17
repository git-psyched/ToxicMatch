const { useState, useEffect, useRef } = React;
const e = React.createElement;

function ToxicMatch() {
  const [gameState, setGameState] = useState('menu'); 
  const [score, setScore] = useState(0);
  const [fallingMeds, setFallingMeds] = useState([]);
  const [difficulty, setDifficulty] = useState('medium');
  const gameLoopRef = useRef(null);
  const medIdCounter = useRef(0);

  const level = DIFFICULTY_LEVELS[difficulty];

  useEffect(() => {
    if (gameState !== 'playing') return;

    gameLoopRef.current = setInterval(() => {
      const medNames = Object.keys(MED_SIDE_EFFECTS);
      const randomName = medNames[Math.floor(Math.random() * medNames.length)];
      
      setFallingMeds(prev => [...prev, {
        id: medIdCounter.current++,
        name: randomName,
        top: -10,
        left: Math.random() * 80 + 10,
        speed: Math.random() * 1 + 0.5
      }]);
    }, level.fallSpeed);

    const moveInterval = setInterval(() => {
      setFallingMeds(prev => {
        const updated = prev.map(m => ({ ...m, top: m.top + m.speed }));
        if (updated.some(m => m.top > 80)) {
          setGameState('gameOver');
          clearInterval(gameLoopRef.current);
          clearInterval(moveInterval);
        }
        return updated;
      });
    }, 50);

    return () => {
      clearInterval(gameLoopRef.current);
      clearInterval(moveInterval);
    };
  }, [gameState, difficulty]);

  const handleMatch = (effect) => {
    if (fallingMeds.length === 0) return;
    
    // Check the bottom-most med
    const targetMed = fallingMeds[0];
    const correctEffects = MED_SIDE_EFFECTS[targetMed.name];

    if (correctEffects.includes(effect)) {
      setScore(s => s + 10);
      setFallingMeds(prev => prev.slice(1));
    } else {
      // Penalty for wrong answer: speed up existing meds
      setFallingMeds(prev => prev.map(m => ({ ...m, speed: m.speed + 0.5 })));
    }
  };

  if (gameState === 'menu') {
    return e('div', {className: 'flex flex-col items-center justify-center h-screen space-y-6'},
      e('h1', {className: 'text-5xl font-bold text-slate-800'}, 'ToxicMatch'),
      e('p', {className: 'text-slate-500 italic'}, 'Classify the toxicity before the ward overflows.'),
      e('div', {className: 'flex gap-4'},
        ['easy', 'medium', 'hard'].map(d => 
          e('button', {
            key: d,
            onClick: () => { setDifficulty(d); setGameState('playing'); },
            className: 'px-6 py-2 border border-slate-800 hover:bg-slate-800 hover:text-white transition-all uppercase tracking-widest text-sm'
          }, d)
        )
      )
    );
  }

  if (gameState === 'gameOver') {
    return e('div', {className: 'flex flex-col items-center justify-center h-screen'},
      e('h2', {className: 'text-3xl mb-4'}, 'Ward Overloaded'),
      e('p', {className: 'text-xl mb-6'}, `Final Score: ${score}`),
      e('button', {
        onClick: () => location.reload(),
        className: 'bg-slate-800 text-white px-8 py-3 rounded'
      }, 'Try Again')
    );
  }

  return e('div', {className: 'h-screen flex flex-col'},
    // Score Bar
    e('div', {className: 'p-4 border-b flex justify-between items-center bg-white'},
      e('span', {className: 'font-bold uppercase tracking-tighter'}, `Rank: ${level.name}`),
      e('span', {className: 'text-2xl font-bold'}, score)
    ),

    // Game Field
    e('div', {className: 'flex-grow relative bg-slate-50 overflow-hidden'},
      fallingMeds.map(m => 
        e('div', {
          key: m.id,
          style: { top: `${m.top}%`, left: `${m.left}%`, position: 'absolute' },
          className: 'falling-pill bg-white px-4 py-2 medical-card font-bold text-slate-800'
        }, m.name)
      )
    ),

    // Static Interaction Grid
    e('div', {className: 'p-4 bg-white border-t grid grid-cols-3 gap-2 h-1/3 overflow-y-auto'},
      SIDE_EFFECT_CATEGORIES.map(effect => 
        e('button', {
          key: effect,
          onClick: () => handleMatch(effect),
          className: 'border border-slate-200 hover:bg-slate-100 py-2 px-1 text-[10px] font-bold uppercase text-slate-600 rounded'
        }, effect)
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e(ToxicMatch));
