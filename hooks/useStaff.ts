import { getData, setData } from "@/lib/localStorage";
import { Staff } from "@/models/staff";
import { useEffect, useState } from "react";

const STAFF_KEY = "staff";

export function useStaff() {
  const [staffList, setStaffList] = useState<Staff[]>([]);

  useEffect(() => {
    setStaffList(getData(STAFF_KEY));
  }, []);

  const addStaff = (staff: Staff) => {
    const updated = [...staffList, staff];
    setStaffList(updated);
    setData(STAFF_KEY, updated);
  };

  const removeStaff = (id: string) => {
    const updated = staffList.filter((s) => s.id !== id);
    setStaffList(updated);
    setData(STAFF_KEY, updated);
  };

  return { staffList, addStaff, removeStaff };
}
