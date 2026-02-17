// ... (Audio Engine remains the same)

function ToxicMatch() {
  // ... (States remain same)
  const [lastMistakeId, setLastMistakeId] = useState(null);

  const handleMatch = (effect) => {
    if (fallingMeds.length === 0) return;
    const targetMed = fallingMeds[0];
    
    if (MED_SIDE_EFFECTS[targetMed.name].includes(effect)) {
      playTone(880, 'sine', 0.1); 
      setScore(s => s + 10);
      setFallingMeds(prev => prev.slice(1));
      setLastMistakeId(null);
    } else {
      playTone(200, 'triangle', 0.2); 
      setLastMistakeId(targetMed.id); // Trigger shake animation
      setTimeout(() => setLastMistakeId(null), 400);
    }
  };

  // ... (Menu and Game Over logic remain same)

  return e('div', {className: 'h-screen flex flex-col bg-slate-50'},
    // ... (Header remains same)
    
    e('div', {className: 'flex-grow relative overflow-hidden'},
      fallingMeds.map(m => 
        e('div', {
          key: m.id,
          style: { 
            top: `${m.top}%`, 
            left: `${m.left}%`, 
            position: 'absolute', 
            transform: 'translateX(-50%)',
            animation: lastMistakeId === m.id ? 'shake 0.4s' : 'none' // Add shake
          },
          className: 'bg-white border-2 border-slate-900 px-4 py-2 shadow-xl font-bold text-lg falling-pill'
        }, m.name)
      )
    ),
    
    // ... (Dashboard remains same)
  );
}
