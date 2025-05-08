"use client";

import ExportButton from "@/components/ExportButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useShifts } from "@/hooks/useShifts";
import { useStaff } from "@/hooks/useStaff";
import { Shift } from "@/models/shift";
import { addDays, addWeeks, format, startOfWeek, subWeeks } from "date-fns";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

export default function ShiftCalendar() {
  const { shifts, addShift } = useShifts();
  const { staffList } = useStaff();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [staffId, setStaffId] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  // ✅ Restore week from localStorage on client only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("shift-week");
      if (stored) {
        setCurrentWeekStart(new Date(stored));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("shift-week", currentWeekStart.toISOString());
    }
  }, [currentWeekStart]);

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  );

  const handleSave = () => {
    if (!staffId) return;

    const newShift: Shift = {
      id: editingShift?.id ?? uuid(),
      staffId,
      date: selectedDate,
      startTime,
      endTime,
    };

    if (editingShift) {
      const filtered = shifts.filter((s) => s.id !== editingShift.id);
      if (typeof window !== "undefined") {
        localStorage.setItem("shifts", JSON.stringify([...filtered, newShift]));
      }
    } else {
      addShift(newShift);
    }

    closeModal();
  };

  const handleDelete = () => {
    if (!editingShift) return;
    const updated = shifts.filter((s) => s.id !== editingShift.id);
    if (typeof window !== "undefined") {
      localStorage.setItem("shifts", JSON.stringify(updated));
    }
    closeModal();
  };

  const handleOpenAdd = (date: string) => {
    setSelectedDate(date);
    setEditingShift(null);
    setStaffId("");
    setStartTime("09:00");
    setEndTime("17:00");
    setModalOpen(true);
  };

  const handleOpenEdit = (shift: Shift) => {
    setEditingShift(shift);
    setSelectedDate(shift.date);
    setStartTime(shift.startTime);
    setEndTime(shift.endTime);
    setStaffId(shift.staffId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingShift(null);
    setStaffId("");
    setStartTime("09:00");
    setEndTime("17:00");
  };

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="text-xl font-semibold">
          Week of {format(currentWeekStart, "dd MMM yyyy")}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Input
            type="date"
            value={format(currentWeekStart, "yyyy-MM-dd")}
            onChange={(e) => {
              const selected = new Date(e.target.value);
              const start = startOfWeek(selected, { weekStartsOn: 1 });
              setCurrentWeekStart(start);
            }}
          />
          <Button
            variant="outline"
            onClick={() => setCurrentWeekStart((prev) => subWeeks(prev, 1))}
          >
            ← Prev Week
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))
            }
          >
            Today
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentWeekStart((prev) => addWeeks(prev, 1))}
          >
            Next Week →
          </Button>
          <ExportButton weekStart={currentWeekStart} />
        </div>
      </div>

      {/* Weekly Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const dateStr = day.toISOString().split("T")[0];
          const dayShifts = shifts.filter((s) => s.date === dateStr);

          return (
            <div
              key={dateStr}
              className="border rounded-md min-h-[200px] p-2 flex flex-col justify-between"
              onClick={() => handleOpenAdd(dateStr)}
            >
              <div className="text-sm font-semibold text-muted-foreground text-center mb-2">
                {format(day, "EEE dd/MM")}
              </div>
              <div className="flex flex-col gap-2 grow">
                {dayShifts.map((shift) => {
                  const staff = staffList.find((s) => s.id === shift.staffId);
                  return (
                    <div
                      key={shift.id}
                      className="rounded bg-muted p-2 text-xs hover:bg-primary/10 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(shift);
                      }}
                    >
                      <div className="font-medium truncate">
                        {staff?.name || "Unknown"}
                      </div>
                      <div className="text-muted-foreground">
                        {shift.startTime} - {shift.endTime}
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button
                variant="ghost"
                className="text-xs mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenAdd(dateStr);
                }}
              >
                + Add Shift
              </Button>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger asChild />
        <DialogContent>
          <DialogTitle className="text-lg font-bold">
            {editingShift ? "Edit Shift" : "Add Shift"}
          </DialogTitle>
          <div className="space-y-3 mt-2">
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <Label>Staff</Label>
              <select
                className="w-full border rounded p-2"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
              >
                <option value="">Select staff</option>
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Start</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <Label>End</Label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleSave} className="w-full">
                {editingShift ? "Update Shift" : "Save Shift"}
              </Button>
              {editingShift && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
