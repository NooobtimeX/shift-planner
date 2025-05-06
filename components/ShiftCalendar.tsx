"use client";

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
import { addDays, format, startOfWeek } from "date-fns";
import { useState } from "react";
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

  const handleSave = () => {
    if (!staffId) return;

    const newShift: Shift = {
      id: editingShift?.id ?? uuid(),
      staffId,
      date: selectedDate,
      startTime,
      endTime,
    };

    // Replace if editing
    if (editingShift) {
      const filtered = shifts.filter((s) => s.id !== editingShift.id);
      localStorage.setItem("shifts", JSON.stringify([...filtered, newShift]));
    } else {
      addShift(newShift);
    }

    // Reset state
    setModalOpen(false);
    setEditingShift(null);
    setStaffId("");
    setStartTime("09:00");
    setEndTime("17:00");
  };

  const handleOpenAdd = (date: string, time: string) => {
    setSelectedDate(date);
    setStartTime(time);
    setEndTime(time);
    setEditingShift(null);
    setStaffId("");
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

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i)
  );

  const timeSlots = Array.from({ length: 11 }, (_, i) => {
    const hour = 8 + i;
    return `${String(hour).padStart(2, "0")}:00`; // 08:00 to 18:00
  });

  const getShiftsAtTime = (date: string, time: string): Shift[] => {
    return shifts.filter((s) => {
      if (s.date !== date) return false;
      if (s.startTime === s.endTime) return s.startTime === time;
      return time >= s.startTime && time < s.endTime;
    });
  };

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-[100px_repeat(7,minmax(120px,1fr))] border">
        {/* Header */}
        <div className="bg-muted p-2 text-sm font-semibold">Time</div>
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className="bg-muted p-2 text-sm font-semibold text-center"
          >
            {format(day, "EEE dd/MM")}
          </div>
        ))}

        {/* Time Rows */}
        {timeSlots.map((time) => (
          <div className="contents" key={time}>
            <div className="border p-2 text-sm text-muted-foreground">
              {time}
            </div>
            {weekDays.map((day) => {
              const dateStr = day.toISOString().split("T")[0];
              const timeShifts = getShiftsAtTime(dateStr, time);

              return (
                <div
                  key={dateStr + time}
                  className="border p-2 text-xs text-center hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => handleOpenAdd(dateStr, time)}
                >
                  {timeShifts.length > 0 ? (
                    timeShifts.map((shift) => {
                      const staff = staffList.find(
                        (s) => s.id === shift.staffId
                      );
                      return (
                        <div
                          key={shift.id}
                          className="rounded bg-muted p-1 mb-1 hover:bg-primary/10"
                          onClick={(e) => {
                            e.stopPropagation(); // prevent outer onClick
                            handleOpenEdit(shift);
                          }}
                        >
                          <div className="font-medium truncate">
                            {staff?.name || "Unknown"}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {shift.startTime} - {shift.endTime}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-muted-foreground">+</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Modal for Add/Edit */}
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
            <Button onClick={handleSave} className="w-full mt-2">
              {editingShift ? "Update Shift" : "Save Shift"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
