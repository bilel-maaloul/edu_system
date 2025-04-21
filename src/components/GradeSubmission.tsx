
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ConstraintValidator } from '@/patterns/ocl/OCLConstraints';
import { Grade, Submission } from '@/types';

interface GradeSubmissionProps {
  submission: Submission;
  teacherId: string;
  maxPoints: number;
  onGradeSubmit: (grade: Grade) => void;
}

const GradeSubmission = ({ submission, teacherId, maxPoints, onGradeSubmit }: GradeSubmissionProps) => {
  const [open, setOpen] = useState(false);
  const [gradeValue, setGradeValue] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!ConstraintValidator.validateGrade({ value: gradeValue }, maxPoints)) {
      toast({
        title: "Invalid grade",
        description: `Grade must be between 0 and ${maxPoints} points`,
        variant: "destructive",
      });
      return;
    }

    const newGrade: Grade = {
      id: Math.random().toString(36).substr(2, 9),
      value: gradeValue,
      feedback,
      assignmentId: submission.assignmentId,
      studentId: submission.studentId,
      gradedBy: teacherId,
      gradedAt: new Date(),
    };

    onGradeSubmit(newGrade);
    setOpen(false);
    setGradeValue(0);
    setFeedback("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Grade Submission</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Grade Submission</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Student's Work:</label>
            <div className="mt-1 p-4 bg-muted rounded-md">
              <p className="text-sm">{submission.content}</p>
            </div>
          </div>
          <div>
            <label htmlFor="grade" className="block text-sm font-medium">
              Grade (0-{maxPoints})
            </label>
            <Input
              id="grade"
              type="number"
              min={0}
              max={maxPoints}
              value={gradeValue}
              onChange={(e) => setGradeValue(Number(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium">
              Feedback
            </label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="mt-1"
              placeholder="Provide feedback to the student..."
            />
          </div>
          <DialogFooter>
            <Button type="submit">Submit Grade</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GradeSubmission;
