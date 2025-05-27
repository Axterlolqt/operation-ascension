import { useState, useEffect } from "react";

const PlanJournalier = ({ routine }) => {
  const [checklist, setChecklist] = useState([]);

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const savedDate = localStorage.getItem("routineDate");
    const saved = localStorage.getItem("routineChecklist");

    if (saved && savedDate === today) {
      setChecklist(JSON.parse(saved));
    } else {
      setChecklist(routine);
      localStorage.setItem("routineDate", today);
      localStorage.setItem("routineChecklist", JSON.stringify(routine));
    }
  }, [routine]);

  const toggleDone = (index) => {
    const updated = [...checklist];
    updated[index].done = !updated[index].done;
    setChecklist(updated);
    localStorage.setItem("routineChecklist", JSON.stringify(updated));
  };

  return (
    <div className="bg-[#1a1e1c] text-green-300 p-6 rounded-xl max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-center mb-4">🗓️ Plan Journalier</h2>
      <ul className="space-y-3">
        {checklist.map((item, i) => (
          <li key={i} className="flex items-center justify-between border-b border-gray-700 pb-2">
            <div>
              <p className="text-sm text-gray-400">{item.heure}</p>
              <p className="text-lg">{item.action}</p>
            </div>
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => toggleDone(i)}
              className="h-5 w-5"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlanJournalier;
