import React, { useEffect, useState } from "react";

function App() {
  const missions = [
    "Entraînement physique",
    "Repas sain",
    "Lecture 10 min",
    "Hydratation",
    "Sommeil 7h+",
  ];

  const XP_PER_MISSION = 20;
  const maxXP = 1500;

  const today = new Date().toLocaleDateString();

  const [currentXP, setCurrentXP] = useState(() => {
    const savedXP = localStorage.getItem("xp");
    return savedXP ? parseInt(savedXP) : 0;
  });

  const [completed, setCompleted] = useState(() => {
    const savedDate = localStorage.getItem("lastReset");
    if (savedDate !== today) return Array(missions.length).fill(false);
    const saved = localStorage.getItem("completed");
    return saved ? JSON.parse(saved) : Array(missions.length).fill(false);
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("history");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("xp", currentXP);
    localStorage.setItem("completed", JSON.stringify(completed));
    localStorage.setItem("lastReset", today);
    localStorage.setItem("history", JSON.stringify(history));
  }, [currentXP, completed, history]);

  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0);
    const timeout = tomorrow - now;

    const resetAtMidnight = setTimeout(() => {
      setCompleted(Array(missions.length).fill(false));
    }, timeout);

    return () => clearTimeout(resetAtMidnight);
  }, []);

  const toggleMission = (index) => {
    const updated = [...completed];
    const wasCompleted = updated[index];
    updated[index] = !wasCompleted;

    const xpChange = wasCompleted ? -XP_PER_MISSION : XP_PER_MISSION;
    const newXP = Math.min(Math.max(currentXP + xpChange, 0), maxXP);
    setCurrentXP(newXP);
    setCompleted(updated);

    const missionDoneToday = updated.includes(true);
    setHistory((prev) => ({
      ...prev,
      [today]: missionDoneToday,
    }));
  };

  const xpPercent = (currentXP / maxXP) * 100;

  let rank = "Recrue";
  if (currentXP >= 1200) rank = "Commandant";
  else if (currentXP >= 900) rank = "Adjudant";
  else if (currentXP >= 600) rank = "Sergent";
  else if (currentXP >= 300) rank = "Caporal";

  const activeDays = Object.values(history).filter(Boolean).length;
  const avgXP = activeDays ? Math.round(currentXP / activeDays) : 0;

  const planning = [
    "Réveil à 5h15",
    "Hygiène + habillage (5h15 - 5h30)",
    "Petit café + journal (5h30 - 6h)",
    "Départ travail (6h - 6h30)",
    "Travail (6h30 - 14h)",
    "Retour + repas (14h - 15h)",
    "Temps libre / repos (15h - 16h30)",
    "Missions / réflexion (16h30 - 17h30)",
    "Préparation repas + soirée (18h - 21h)",
    "Coupure écran + lecture + dodo (21h - 22h)"
  ];

  return (
    <div className="w-screen min-h-screen bg-[#1a1e1c] text-green-300 p-8">
      <h1 className="text-4xl font-bold uppercase tracking-wider text-center mb-12">
        Poste de Commandement
      </h1>

      <div className="max-w-xl mx-auto bg-[#2a2f2d] rounded-xl p-6 shadow-lg mb-8">
        <div className="mb-4">
          <p className="text-sm uppercase text-gray-400">Rang actuel</p>
          <h2 className="text-2xl font-bold">{rank}</h2>
        </div>

        <div className="mb-2">
          <p className="text-sm text-gray-400">
            Progression : {currentXP} / {maxXP} XP
          </p>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden mb-6">
          <div
            className="bg-green-500 h-4 transition-all duration-500"
            style={{ width: `${xpPercent}%` }}
          ></div>
        </div>

        <div className="mb-6">
          <p className="text-sm uppercase text-gray-400 mb-2">Missions du jour</p>
          <ul className="space-y-2">
            {missions.map((mission, i) => (
              <li key={i} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={completed[i]}
                  onChange={() => toggleMission(i)}
                  className="form-checkbox h-5 w-5 text-green-500 bg-gray-800 border-gray-600 rounded"
                />
                <span className="text-lg">{mission}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 border-t border-gray-600 pt-4">
          <p className="text-sm uppercase text-gray-400 mb-2">Statistiques personnelles</p>
          <ul className="space-y-1 text-lg">
            <li>📅 Jours actifs : {activeDays}</li>
            <li>📊 XP moyenne / jour actif : {avgXP} XP</li>
          </ul>
        </div>
      </div>

      <div className="max-w-xl mx-auto bg-[#2a2f2d] rounded-xl p-6 shadow-lg mb-8">
        <h2 className="text-xl font-bold text-center mb-4">🗓️ Planning du jour</h2>
        <ul className="space-y-2">
          {planning.map((task, i) => (
            <li key={i} className="flex items-center space-x-3">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-green-500 bg-gray-800 border-gray-600" />
              <span className="text-lg">{task}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="max-w-xl mx-auto bg-[#2a2f2d] rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Historique des 90 derniers jours</h3>
        <div className="grid grid-cols-10 gap-1">
          {Array.from({ length: 90 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (89 - i));
            const key = date.toLocaleDateString();
            const active = history[key];
            return (
              <div
                key={i}
                title={`${key} - ${active ? 'Actif' : 'Inactif'}`}
                className={`w-6 h-6 rounded ${active ? 'bg-green-500' : 'bg-gray-700'}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
