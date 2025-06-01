// src/WeeklyChecklist.jsx
import { useState, useEffect } from "react";

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const defaultTasks = {
  "Réveil à l’heure": true,
  "Routine matinale (hygiène, habits)": true,
  "Petit moment calme / café / journaling": true,
  "Travail 7h30-16h": true,
  "Préparation repas / repas midi": true,
  "Mise à jour app": true,
  "Sport (si jour d'entraînement)": false,
  "Préparation dîner / repas soir": true,
  "Préparation du lendemain": true,
  "Temps libre (limité si objectifs non atteints)": true,
  "Lecture ou détente avant dodo": true,
  "Coucher à l’heure": true,
  "Courses (si jour prévu)": false,
  "Faire la liste des courses": false,
};

const getDayTasks = (day) => {
  const tasks = { ...defaultTasks };
  if (["Mardi", "Jeudi", "Samedi"].includes(day)) tasks["Sport (si jour d'entraînement)"] = true;
  if (["Mardi", "Samedi"].includes(day)) {
    tasks["Courses (si jour prévu)"] = true;
    tasks["Faire la liste des courses"] = true;
  }
  if (["Samedi", "Dimanche"].includes(day)) tasks["Travail 7h30-16h"] = false;
  return tasks;
};

export default function WeeklyChecklist() {
  const [checked, setChecked] = useState(() => {
    const saved = localStorage.getItem("weekly-tasks");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("weekly-tasks", JSON.stringify(checked));
  }, [checked]);

  const toggle = (day, task) => {
    const updated = { ...checked };
    updated[day] = updated[day] || getDayTasks(day);
    updated[day][task] = !updated[day][task];
    setChecked(updated);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#2a2f2d] rounded-xl shadow text-green-300 mt-12">
      <h2 className="text-2xl font-bold mb-6 text-center uppercase">Planning Hebdo</h2>
      {days.map((day) => (
        <div key={day} className="mb-8">
          <h3 className="text-xl font-semibold mb-2 text-green-400">{day}</h3>
          <ul className="space-y-1">
            {Object.entries(getDayTasks(day)).map(([task, show]) =>
              show ? (
                <li key={task} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={checked[day]?.[task] || false}
                    onChange={() => toggle(day, task)}
                    className="h-5 w-5 text-green-500 bg-gray-800 border-gray-600 rounded"
                  />
                  <label>{task}</label>
                </li>
              ) : null
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}
