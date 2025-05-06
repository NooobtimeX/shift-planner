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
import { useStaff } from "@/hooks/useStaff";
import { Shift } from "@/models/shift";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

type ShiftFormModalProps = {
  triggerLabel?: string;
  initialShift?: Shift;
  onSave: (shift: Shift) => void;
  mode?: "add" | "edit";
};

export default function ShiftFormModal({
  triggerLabel = "+ Add Shift",
  initialShift,
  onSave,
  mode = "add",
}: ShiftFormModalProps) {
  const { staffList } = useStaff();

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [staffId, setStaffId] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  useEffect(() => {
    if (initialShift) {
      setDate(initialShift.date);
      setStaffId(initialShift.staffId);
      setStartTime(initialShift.startTime);
      setEndTime(initialShift.endTime);
    }
  }, [initialShift]);

  const handleSubmit = () => {
    if (!staffId || !date || !startTime || !endTime) return;

    const newShift: Shift = {
      id: initialShift?.id ?? uuid(),
      staffId,
      date,
      startTime,
      endTime,
    };

    onSave(newShift);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={mode === "add" ? "outline" : "ghost"}
          className="text-sm"
        >
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-lg font-bold">
          {mode === "add" ? "Add Shift" : "Edit Shift"}
        </DialogTitle>
        <div className="space-y-3 mt-2">
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <Label>Staff</Label>
            <select
              className="w-full border rounded px-3 py-2 text-sm"
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
          {/**
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Start Time</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <Label>End Time</Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          */}
          <Button className="w-full mt-4" onClick={handleSubmit}>
            {mode === "add" ? "Save Shift" : "Update Shift"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
