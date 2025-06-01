import React, { useState, useEffect } from "react";
import WeeklyChecklist from "./WeeklyChecklist";

function App() {
  const missions = [
    "Entraînement physique",
    "Repas sain",
    "Lecture 10 min",
    "Hydratation",
    "Sommeil 7h+",
  ];

  const specialMissions = [
    "Course à pied",
    "Lecture longue",
    "Pas de réseaux sociaux",
    "Méditation",
    "Gainage 2 min",
    "50 tractions",
    "Nettoyage / rangement",
    "Etude / apprentissage 20 min",
  ];

  const XP_PER_MISSION = 20;
  const maxXP = 1500;
  const today = new Date().toLocaleDateString();

  const [currentXP, setCurrentXP] = useState(() => parseInt(localStorage.getItem("xp")) || 0);
  const [completed, setCompleted] = useState(() => {
    const savedDate = localStorage.getItem("lastReset");
    if (savedDate !== today) return Array(missions.length).fill(false);
    return JSON.parse(localStorage.getItem("completed")) || Array(missions.length).fill(false);
  });
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem("history")) || {});
  const [journal, setJournal] = useState("");
  const [journalHistory, setJournalHistory] = useState(() => JSON.parse(localStorage.getItem("journalHistory")) || {});

  const [specialMission, setSpecialMission] = useState(() => {
    const saved = localStorage.getItem("specialMission");
    const savedDate = localStorage.getItem("specialMissionDate");
    if (savedDate === today && saved) return saved;
    if (Math.random() < 0.3) {
      const chosen = specialMissions[Math.floor(Math.random() * specialMissions.length)];
      localStorage.setItem("specialMission", chosen);
      localStorage.setItem("specialMissionDate", today);
      return chosen;
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem("xp", currentXP);
    localStorage.setItem("completed", JSON.stringify(completed));
    localStorage.setItem("lastReset", today);
    localStorage.setItem("history", JSON.stringify(history));
    localStorage.setItem("journalHistory", JSON.stringify(journalHistory));
  }, [currentXP, completed, history, journalHistory]);

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
    setHistory((prev) => ({ ...prev, [today]: updated.includes(true) }));
  };

  const handleJournalSave = () => {
    setJournalHistory((prev) => ({ ...prev, [today]: journal }));
    setJournal("");
  };

  const xpPercent = (currentXP / maxXP) * 100;
  let rank = "Recrue";
  if (currentXP >= 1200) rank = "Commandant";
  else if (currentXP >= 900) rank = "Adjudant";
  else if (currentXP >= 600) rank = "Sergent";
  else if (currentXP >= 300) rank = "Caporal";

  const activeDays = Object.values(history).filter(Boolean).length;
  const avgXP = activeDays ? Math.round(currentXP / activeDays) : 0;

  return (
    <div className="w-screen min-h-screen bg-[#1a1e1c] text-green-300 p-8">
      <h1 className="text-4xl font-bold uppercase tracking-wider text-center mb-12">Poste de Commandement</h1>

      <div className="max-w-xl mx-auto bg-[#2a2f2d] rounded-xl p-6 shadow-lg mb-8">
        <div className="mb-4">
          <p className="text-sm uppercase text-gray-400">Rang actuel</p>
          <h2 className="text-2xl font-bold">{rank}</h2>
        </div>

        <div className="mb-2">
          <p className="text-sm text-gray-400">Progression : {currentXP} / {maxXP} XP</p>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden mb-6">
          <div className="bg-green-500 h-4 transition-all duration-500" style={{ width: `${xpPercent}%` }}></div>
        </div>

        <div className="mb-6">
          <p className="text-sm uppercase text-gray-400 mb-2">Missions du jour</p>
          <ul className="space-y-2">
            {missions.map((mission, i) => (
              <li key={i} className="flex items-center space-x-3">
                <input type="checkbox" checked={completed[i]} onChange={() => toggleMission(i)} className="form-checkbox h-5 w-5 text-green-500 bg-gray-800 border-gray-600 rounded" />
                <span className="text-lg">{mission}</span>
              </li>
            ))}
            {specialMission && (
              <li className="flex items-center space-x-3">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-yellow-500 bg-gray-800 border-gray-600 rounded" />
                <span className="text-lg text-yellow-400">Mission Spéciale : {specialMission}</span>
              </li>
            )}
          </ul>
        </div>

        <div className="mt-8 border-t border-gray-600 pt-4">
          <p className="text-sm uppercase text-gray-400 mb-2">Statistiques personnelles</p>
          <ul className="space-y-1 text-lg">
            <li>📅 Jours actifs : {activeDays}</li>
            <li>📊 XP moyenne / jour actif : {avgXP} XP</li>
          </ul>
        </div>

        <div className="mt-8 border-t border-gray-600 pt-4">
          <p className="text-sm uppercase text-gray-400 mb-2">Journal du jour</p>
          <textarea className="w-full h-24 p-2 bg-gray-800 border border-gray-700 rounded text-green-200" value={journal} onChange={(e) => setJournal(e.target.value)} placeholder="Réflexions, émotions, défis du jour..." />
          <button onClick={handleJournalSave} className="mt-2 bg-green-600 px-4 py-2 rounded hover:bg-green-700">Sauvegarder</button>

          {Object.keys(journalHistory).length > 0 && (
            <div className="mt-4">
              <p className="text-sm uppercase text-gray-400 mb-2">Journaux précédents</p>
              <ul className="space-y-1 text-sm max-h-32 overflow-y-auto">
                {Object.entries(journalHistory).map(([date, entry]) => (
                  <li key={date}><strong>{date} :</strong> {entry}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <WeeklyChecklist />
    </div>
  );
}

export default App;
