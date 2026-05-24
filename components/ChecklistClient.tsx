"use client";

import { useState, useEffect } from "react";
import { DEFAULT_CHECKLIST, type ChecklistCategory } from "@/lib/checklist-data";

function loadChecked(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const saved = localStorage.getItem("checklist-checked");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  } catch {
    return new Set();
  }
}

function saveChecked(checked: Set<string>) {
  localStorage.setItem("checklist-checked", JSON.stringify([...checked]));
}

export default function ChecklistClient() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setChecked(loadChecked());
    setMounted(true);
  }, []);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveChecked(next);
      return next;
    });
  };

  const resetAll = () => {
    setChecked(new Set());
    saveChecked(new Set());
  };

  const totalItems = DEFAULT_CHECKLIST.reduce((acc, cat) => acc + cat.items.length, 0);
  const checkedCount = checked.size;
  const progress = totalItems === 0 ? 0 : Math.round((checkedCount / totalItems) * 100);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* 進捗バー */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">準備の進捗</span>
          <span className="text-sm font-bold text-emerald-600">{checkedCount} / {totalItems}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className="bg-emerald-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && (
          <p className="text-center text-emerald-600 font-semibold mt-2 text-sm">
            🎉 準備完了！良い旅を！
          </p>
        )}
      </div>

      {/* カテゴリ別チェックリスト */}
      {DEFAULT_CHECKLIST.map((category) => (
        <CategorySection
          key={category.id}
          category={category}
          checked={checked}
          onToggle={toggle}
        />
      ))}

      {/* リセットボタン */}
      {checkedCount > 0 && (
        <button
          onClick={resetAll}
          className="text-sm text-gray-400 underline text-center py-2"
        >
          チェックをすべてリセット
        </button>
      )}
    </div>
  );
}

function CategorySection({
  category,
  checked,
  onToggle,
}: {
  category: ChecklistCategory;
  checked: Set<string>;
  onToggle: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const categoryChecked = category.items.filter((item) => checked.has(item.id)).length;
  const allDone = categoryChecked === category.items.length;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <span className="text-xl">{category.icon}</span>
        <span className="flex-1 font-semibold text-gray-800">{category.title}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${allDone ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
          {categoryChecked}/{category.items.length}
        </span>
        <span className="text-gray-400 text-sm">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <ul className="border-t border-gray-100 divide-y divide-gray-50">
          {category.items.map((item) => {
            const isChecked = checked.has(item.id);
            return (
              <li key={item.id}>
                <button
                  onClick={() => onToggle(item.id)}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isChecked ? "bg-emerald-500 border-emerald-500" : "border-gray-300"}`}>
                    {isChecked && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm leading-snug ${isChecked ? "line-through text-gray-400" : "text-gray-800"}`}>
                      {item.label}
                    </p>
                    {item.note && (
                      <p className="text-xs text-gray-400 mt-0.5">{item.note}</p>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
