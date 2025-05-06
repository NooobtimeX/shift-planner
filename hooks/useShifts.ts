import { getData, setData } from "@/lib/localStorage";
import { Shift } from "@/models/shift";
import { useEffect, useState } from "react";

const SHIFT_KEY = "shifts";

export function useShifts() {
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    setShifts(getData(SHIFT_KEY));
  }, []);

  const addShift = (shift: Shift) => {
    const updated = [...shifts, shift];
    setShifts(updated);
    setData(SHIFT_KEY, updated);
  };

  const removeShift = (id: string) => {
    const updated = shifts.filter((s) => s.id !== id);
    setShifts(updated);
    setData(SHIFT_KEY, updated);
  };

  return { shifts, addShift, removeShift };
}
