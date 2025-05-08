"use client";

import ShiftCalendar from "@/components/ShiftCalendar";
import StaffCard from "@/components/StaffCard";
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
import { Staff } from "@/models/staff";
import { PlusIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { v4 as uuid } from "uuid";

export default function HomePage() {
  const { staffList, addStaff } = useStaff();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const handleAdd = () => {
    if (!name || !role) return;

    const newStaff: Staff = {
      id: uuid(),
      name,
      role,
    };

    addStaff(newStaff);
    setName("");
    setRole("");
    setOpen(false);
  };

  return (
    <main className="p-4 space-y-10">
      <section>
        <h1 className="text-xl font-bold mb-4">📅 Shift Planner</h1>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">This Week</h2>
        </div>
        <ShiftCalendar />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">👤 Staff</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {staffList.map((staff) => (
            <StaffCard key={staff.id} staff={staff} />
          ))}
        </div>
      </section>

      {/* Add Staff Floating Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg text-white bg-primary hover:bg-primary/90"
            aria-label="Add Staff"
          >
            <PlusIcon className="w-6 h-6" />
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogTitle>Add Staff</DialogTitle>
          <div className="space-y-3 mt-2">
            <div>
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alice"
              />
            </div>
            <div>
              <Label>Role</Label>
              <Input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Cashier"
              />
            </div>
            <Button className="w-full mt-2" onClick={handleAdd}>
              Save Staff
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
