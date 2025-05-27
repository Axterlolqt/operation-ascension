import { useEffect, useState } from "react";
import PlanJournalier from "./PlanJournalier";

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

  // 👇 Routine du jour ici à modifier chaque soir
  const routineDuJour = [
    { heure: "06h45", action: "Réveil + eau + respiration", done: false },
    { heure: "07h00", action: "Hygiène + habillage", done: false },
    { heure: "07h10", action: "Lecture 10min + journal", done: false },
    { heure: "07h30", action: "Préparation repas", done: false },
    { heure: "09h00", action: "Départ travail", done: false },
    { heure: "12h30", action: "Pause + marche rapide", done: false },
    { heure: "18h15", action: "Retour + douche", done: false },
    { heure: "19h00", action: "Entraînement bas du corps", done: false },
    { heure: "20h00", action: "Repas sans écran", done: false },
    { heure: "20h45", action: "Jeu vidéo (1h max)", done: false },
    { heure: "21h45", action: "Lecture / respiration lente", done: false },
    { heure: "22h30", action: "Coucher", done: false },
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

      {/* Affichage de ta routine journalière */}
      <PlanJournalier routine={routineDuJour} />
    </div>
  );
}

export default App;
