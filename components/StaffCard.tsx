"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useState } from "react";

type Props = {
  staff: Staff;
};

export default function StaffCard({ staff }: Props) {
  const { removeStaff, addStaff } = useStaff();
  const [editOpen, setEditOpen] = useState(false);

  const [name, setName] = useState(staff.name);
  const [role, setRole] = useState(staff.role);

  const handleUpdate = () => {
    addStaff({
      ...staff,
      name,
      role,
    });
    setEditOpen(false);
  };

  return (
    <>
      <Card className="bg-muted/40">
        <CardHeader>
          <CardTitle>{staff.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{staff.role}</p>
        </CardContent>
        <CardFooter className="flex justify-between gap-2">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle className="text-lg font-bold">
                Edit Staff
              </DialogTitle>
              <div className="space-y-3">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <Input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
                <Button className="w-full mt-4" onClick={handleUpdate}>
                  Update
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => removeStaff(staff.id)}
          >
            Delete
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
