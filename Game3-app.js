const { useState, useEffect, useRef } = React;
const e = React.createElement;

function ToxicMatch() {
  const [gameState, setGameState] = useState('menu'); // menu, playing, gameOver
  const [difficulty, setDifficulty] = useState('easy');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [fallingMeds, setFallingMeds] = useState([]);
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [highScores, setHighScores] = useState({easy:0,medium:0,hard:0,insane:0});
  const [showTutorial, setShowTutorial] = useState(false);
  const [streak, setStreak] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const gameLoopRef = useRef(null);
  const medIdCounter = useRef(0);

  // Load high scores
  useEffect(() => {
    const saved = localStorage.getItem('toxicMatchScores');
    if (saved) setHighScores(JSON.parse(saved));
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const level = DIFFICULTY_LEVELS[difficulty];
    
    gameLoopRef.current = setInterval(() => {
      // Spawn new meds
      const newMeds = [];
      for (let i = 0; i < level.medsAtOnce; i++) {
        const med = getRandomMed();
        newMeds.push({
          id: medIdCounter.current++,
          name: med,
          position: Math.random() * 70 + 10, // 10-80% from left
          progress: 0,
          speed: level.fallSpeed
        });
      }
      
      setFallingMeds(prev => {
        // Update existing meds
        const updated = prev.map(med => ({
          ...med,
          progress: med.progress + (100 / (med.speed / 100))
        }));
        
        // Check for meds that hit bottom
        const hitBottom = updated.filter(m => m.progress >= 100);
        if (hitBottom.length > 0) {
          setLives(l => {
            const newLives = Math.max(0, l - hitBottom.length);
            if (newLives === 0) {
              endGame();
            }
            return newLives;
          });
          setStreak(0);
          setComboMultiplier(1);
        }
        
        // Keep only meds that haven't hit bottom
        const stillFalling = updated.filter(m => m.progress < 100);
        return [...stillFalling, ...newMeds];
      });
    }, level.fallSpeed);
    
    return () => clearInterval(gameLoopRef.current);
  }, [gameState, difficulty]);

  const startGame = (diff) => {
    setDifficulty(diff);
    setGameState('playing');
    setScore(0);
    setLives(3);
    setFallingMeds([]);
    setStreak(0);
    setComboMultiplier(1);
    medIdCounter.current = 0;
  };

  const endGame = () => {
    setGameState('gameOver');
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    
    // Save high score
    if (score > highScores[difficulty]) {
      const newScores = {...highScores, [difficulty]: score};
      setHighScores(newScores);
      localStorage.setItem('toxicMatchScores', JSON.stringify(newScores));
    }
  };

  const handleMedClick = (medId, medName) => {
    // Remove the med from falling
    setFallingMeds(prev => prev.filter(m => m.id !== medId));
    
    // Show selection effect
    const med = document.getElementById(`med-${medId}`);
    if (med) {
      med.style.transform = 'scale(1.2)';
      setTimeout(() => {
        if (med) med.style.transform = 'scale(1)';
      }, 200);
    }
  };

  const handleBucketClick = (sideEffect, medId, medName) => {
    if (!medId) return;
    
    const isCorrect = isCorrectMatch(medName, sideEffect);
    
    if (isCorrect) {
      const points = 10 * comboMultiplier;
      setScore(s => s + points);
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak % 5 === 0) {
          setComboMultiplier(m => Math.min(m + 0.5, 5));
        }
        return newStreak;
      });
      
      // Visual feedback
      const bucket = document.getElementById(`bucket-${sideEffect.replace(/\s/g, '')}`);
      if (bucket) {
        bucket.style.backgroundColor = '#10b981';
        setTimeout(() => {
          bucket.style.backgroundColor = '';
        }, 300);
      }
    } else {
      setLives(l => {
        const newLives = Math.max(0, l - 1);
        if (newLives === 0) endGame();
        return newLives;
      });
      setStreak(0);
      setComboMultiplier(1);
      
      // Visual feedback
      const bucket = document.getElementById(`bucket-${sideEffect.replace(/\s/g, '')}`);
      if (bucket) {
        bucket.style.backgroundColor = '#ef4444';
        setTimeout(() => {
          bucket.style.backgroundColor = '';
        }, 300);
      }
    }
    
    setFallingMeds(prev => prev.filter(m => m.id !== medId));
  };

  // Tutorial Screen
  if (showTutorial) {
    return e('div', {className: 'min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-slate-800 p-6 flex items-center justify-center'},
      e('div', {className: 'max-w-md w-full bg-slate-800 rounded-lg border-2 border-purple-500 p-8'},
        e('h2', {className: 'text-3xl font-bold text-purple-400 text-center mb-6'}, '☠️ How to Play'),
        e('div', {className: 'space-y-4 text-slate-200'},
          e('p', {className: 'leading-relaxed'}, '💊 Meds fall from the top'),
          e('p', {className: 'leading-relaxed'}, '🎯 CLICK the falling med to grab it'),
          e('p', {className: 'leading-relaxed'}, '⚡ CLICK the correct side effect bucket at bottom'),
          e('p', {className: 'leading-relaxed'}, '💀 Miss 3 meds = Game Over'),
          e('p', {className: 'leading-relaxed'}, '🔥 Build streaks for combo multipliers!'),
          e('div', {className: 'bg-purple-900/50 p-3 rounded mt-4'},
            e('p', {className: 'text-sm font-semibold text-purple-300'}, 'Example:'),
            e('p', {className: 'text-sm text-slate-300'}, 'LITHIUM falls → Click it → Click "Tremor" bucket → +10 pts!')
          )
        ),
        e('button', {
          onClick: () => setShowTutorial(false),
          className: 'w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors'
        }, 'Let\'s Go!')
      )
    );
  }

  // Menu Screen
  if (gameState === 'menu') {
    return e('div', {className: 'min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-slate-800 p-6 flex items-center justify-center'},
      e('div', {className: 'max-w-md w-full'},
        e('div', {className: 'text-center mb-8'},
          e('h1', {className: 'text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4'}, '☠️ TOXIC MATCH'),
          e('p', {className: 'text-purple-300 text-lg'}, 'Psych Med Side Effect Arcade')
        ),
        e('div', {className: 'bg-slate-800 rounded-lg border-2 border-purple-500 p-6 mb-6'},
          e('h3', {className: 'text-xl font-bold text-purple-400 mb-4 text-center'}, 'Select Difficulty'),
          e('div', {className: 'space-y-3'},
            ...Object.entries(DIFFICULTY_LEVELS).map(([key, level]) =>
              e('button', {
                key: key,
                onClick: () => startGame(key),
                className: 'w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-105'
              },
                e('div', {className: 'text-lg'}, `${level.name}`),
                e('div', {className: 'text-sm opacity-90'}, `${level.medsAtOnce} med${level.medsAtOnce>1?'s':''} at once`),
                highScores[key] > 0 && e('div', {className: 'text-xs mt-1 opacity-75'}, `High Score: ${highScores[key]}`)
              )
            )
          )
        ),
        e('button', {
          onClick: () => setShowTutorial(true),
          className: 'w-full bg-slate-700 hover:bg-slate-600 text-purple-300 font-semibold py-3 rounded-lg transition-colors'
        }, '? How to Play')
      )
    );
  }

  // Game Over Screen
  if (gameState === 'gameOver') {
    const isNewHighScore = score > highScores[difficulty] - score;
    return e('div', {className: 'min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-slate-800 p-6 flex items-center justify-center'},
      e('div', {className: 'max-w-md w-full bg-slate-800 rounded-lg border-2 border-purple-500 p-8'},
        e('h2', {className: 'text-4xl font-bold text-center mb-4'}, 
          isNewHighScore ? e('span', {className: 'text-yellow-400'}, '🏆 NEW HIGH SCORE!') : e('span', {className: 'text-red-400'}, '💀 GAME OVER')
        ),
        e('div', {className: 'text-center mb-6'},
          e('div', {className: 'text-6xl font-bold text-purple-400 mb-2'}, score),
          e('div', {className: 'text-slate-400'}, 'points'),
          e('div', {className: 'text-sm text-slate-500 mt-2'}, `Difficulty: ${DIFFICULTY_LEVELS[difficulty].name}`)
        ),
        e('div', {className: 'grid grid-cols-2 gap-4 mb-6'},
          e('div', {className: 'bg-slate-700 p-3 rounded'},
            e('div', {className: 'text-2xl font-bold text-purple-400'}, highScores[difficulty]),
            e('div', {className: 'text-xs text-slate-400'}, 'High Score')
          ),
          e('div', {className: 'bg-slate-700 p-3 rounded'},
            e('div', {className: 'text-2xl font-bold text-purple-400'}, Math.floor(score / 10)),
            e('div', {className: 'text-xs text-slate-400'}, 'Meds Matched')
          )
        ),
        e('div', {className: 'space-y-3'},
          e('button', {
            onClick: () => startGame(difficulty),
            className: 'w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-colors'
          }, 'Play Again'),
          e('button', {
            onClick: () => setGameState('menu'),
            className: 'w-full bg-slate-700 hover:bg-slate-600 text-purple-300 font-semibold py-3 rounded-lg transition-colors'
          }, 'Main Menu')
        )
      )
    );
  }

  // Playing Screen
  const visibleBuckets = SIDE_EFFECT_CATEGORIES.slice(0, 8); // Show 8 buckets at a time
  
  return e('div', {className: 'min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-slate-800 p-4 relative overflow-hidden'},
    // HUD
    e('div', {className: 'max-w-6xl mx-auto mb-4'},
      e('div', {className: 'flex justify-between items-center bg-slate-800/80 rounded-lg p-4 border border-purple-500'},
        e('div', {className: 'flex items-center gap-4'},
          e('div', null,
            e('div', {className: 'text-2xl font-bold text-purple-400'}, score),
            e('div', {className: 'text-xs text-slate-400'}, 'Score')
          ),
          e('div', null,
            e('div', {className: 'text-lg font-bold text-pink-400'}, `${comboMultiplier}x`),
            e('div', {className: 'text-xs text-slate-400'}, 'Combo')
          )
        ),
        e('div', {className: 'flex gap-2'},
          ...Array(3).fill(0).map((_, i) =>
            e('div', {
              key: i,
              className: `w-8 h-8 rounded-full ${i < lives ? 'bg-red-500' : 'bg-slate-700'}`,
              title: 'Lives'
            }, i < lives ? '❤️' : '💔')
          )
        )
      )
    ),
    
    // Falling zone
    e('div', {
      className: 'max-w-6xl mx-auto bg-slate-900/50 rounded-lg border-2 border-purple-500 relative',
      style: {height: '450px'}
    },
      // Falling meds
      ...fallingMeds.map(med =>
        e('div', {
          key: med.id,
          id: `med-${med.id}`,
          onClick: () => handleMedClick(med.id, med.name),
          className: 'absolute bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-4 py-2 rounded-lg cursor-pointer hover:scale-110 transition-transform shadow-lg border-2 border-purple-400',
          style: {
            left: `${med.position}%`,
            top: `${med.progress}%`,
            transform: 'translateX(-50%)',
            animation: 'pulse 1s infinite'
          }
        }, med.name)
      )
    ),
    
    // Side effect buckets
    e('div', {className: 'max-w-6xl mx-auto mt-4'},
      e('div', {className: 'grid grid-cols-4 gap-2'},
        ...visibleBuckets.map(sideEffect =>
          e('button', {
            key: sideEffect,
            id: `bucket-${sideEffect.replace(/\s/g, '')}`,
            onClick: () => {
              if (fallingMeds.length > 0) {
                const med = fallingMeds[0];
                handleBucketClick(sideEffect, med.id, med.name);
              }
            },
            className: 'bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold py-3 px-2 rounded-lg border-2 border-purple-500 transition-all text-xs leading-tight'
          }, sideEffect)
        )
      )
    ),
    
    // Instructions hint
    e('div', {className: 'text-center mt-4 text-purple-300 text-sm'},
      'Click falling med → Click matching side effect bucket'
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e(ToxicMatch));
