"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BarChart3,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  Send,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ApplicationTrackerPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newApplication, setNewApplication] = useState({
    university: "",
    program: "",
    deadline: "",
    status: "preparing"
  });

  const applications = [
    {
      id: 1,
      university: "Stanford University",
      program: "MS Computer Science",
      deadline: "2024-12-15",
      status: "submitted",
      submittedDate: "2024-11-20",
      applicationFee: "$90",
      requirements: {
        sop: "completed",
        resume: "completed",
        transcripts: "completed",
        lor: "completed",
        testScores: "completed"
      },
      notes: "Strong research match with Prof. Johnson",
      priority: "high"
    },
    {
      id: 2,
      university: "MIT",
      program: "MS Electrical Engineering",
      deadline: "2024-12-31",
      status: "in-review",
      submittedDate: "2024-11-25",
      applicationFee: "$85",
      requirements: {
        sop: "completed",
        resume: "completed",
        transcripts: "completed",
        lor: "pending",
        testScores: "completed"
      },
      notes: "Need to follow up on LOR from Prof. Smith",
      priority: "high"
    },
    {
      id: 3,
      university: "University of Toronto",
      program: "MS Computer Science",
      deadline: "2025-01-15",
      status: "preparing",
      applicationFee: "CAD $125",
      requirements: {
        sop: "in-progress",
        resume: "completed",
        transcripts: "pending",
        lor: "completed",
        testScores: "completed"
      },
      notes: "Backup option, good program",
      priority: "medium"
    },
    {
      id: 4,
      university: "Carnegie Mellon",
      program: "MS Software Engineering",
      deadline: "2024-12-01",
      status: "rejected",
      submittedDate: "2024-10-15",
      applicationFee: "$85",
      requirements: {
        sop: "completed",
        resume: "completed",
        transcripts: "completed",
        lor: "completed",
        testScores: "completed"
      },
      notes: "Very competitive program",
      priority: "high"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted": return "bg-primary text-primary-foreground";
      case "in-review": return "bg-secondary text-secondary-foreground";
      case "accepted": return "bg-accent text-accent-foreground";
      case "rejected": return "bg-destructive text-destructive-foreground";
      case "preparing": return "bg-muted text-muted-foreground";
      case "waitlisted": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted": return Send;
      case "in-review": return Eye;
      case "accepted": return CheckCircle;
      case "rejected": return XCircle;
      case "preparing": return Clock;
      case "waitlisted": return AlertTriangle;
      default: return FileText;
    }
  };

  const getRequirementStatus = (status: string) => {
    switch (status) {
      case "completed": return { color: "text-secondary", icon: CheckCircle };
      case "in-progress": return { color: "text-accent", icon: Clock };
      case "pending": return { color: "text-destructive", icon: AlertTriangle };
      default: return { color: "text-muted-foreground", icon: FileText };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-destructive bg-destructive/10";
      case "medium": return "border-accent bg-accent/10";
      case "low": return "border-muted bg-muted/10";
      default: return "border-muted bg-muted/10";
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const stats = {
    total: applications.length,
    submitted: applications.filter(app => app.status === "submitted" || app.status === "in-review").length,
    preparing: applications.filter(app => app.status === "preparing").length,
    responses: applications.filter(app => app.status === "accepted" || app.status === "rejected").length
  };

  const handleAddApplication = () => {
    // Add logic here
    setShowAddForm(false);
    setNewApplication({ university: "", program: "", deadline: "", status: "preparing" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-card neo-border neo-shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-destructive flex items-center justify-center neo-border">
                <BarChart3 className="w-6 h-6 text-destructive-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-black uppercase tracking-wider neo-heading text-primary">
                  Application Tracker
                </h1>
                <p className="text-muted-foreground font-bold uppercase tracking-wider">
                  Monitor your university applications
                </p>
              </div>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)} className="font-bold uppercase tracking-wider">
              <Plus className="w-4 h-4 mr-2" />
              Add Application
            </Button>
          </div>
          <div className="flex gap-2">
            <div className="w-16 h-2 bg-destructive neo-border transform -skew-x-12"></div>
            <div className="w-12 h-2 bg-primary neo-border transform skew-x-12"></div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card neo-border neo-shadow p-6 text-center">
            <div className="text-3xl font-black text-primary mb-2">{stats.total}</div>
            <p className="font-bold uppercase tracking-wider text-sm text-muted-foreground">Total Applications</p>
          </div>
          <div className="bg-card neo-border neo-shadow p-6 text-center">
            <div className="text-3xl font-black text-secondary mb-2">{stats.submitted}</div>
            <p className="font-bold uppercase tracking-wider text-sm text-muted-foreground">Submitted</p>
          </div>
          <div className="bg-card neo-border neo-shadow p-6 text-center">
            <div className="text-3xl font-black text-accent mb-2">{stats.preparing}</div>
            <p className="font-bold uppercase tracking-wider text-sm text-muted-foreground">In Progress</p>
          </div>
          <div className="bg-card neo-border neo-shadow p-6 text-center">
            <div className="text-3xl font-black text-destructive mb-2">{stats.responses}</div>
            <p className="font-bold uppercase tracking-wider text-sm text-muted-foreground">Responses</p>
          </div>
        </div>

        {/* Add Application Form */}
        {showAddForm && (
          <div className="bg-card neo-border neo-shadow p-6">
            <h2 className="text-xl font-black uppercase tracking-wider mb-4 neo-text-shadow-black">
              Add New Application
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="new-university">University</Label>
                <Input
                  id="new-university"
                  placeholder="University Name"
                  value={newApplication.university}
                  onChange={(e) => setNewApplication({ ...newApplication, university: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-program">Program</Label>
                <Input
                  id="new-program"
                  placeholder="MS Computer Science"
                  value={newApplication.program}
                  onChange={(e) => setNewApplication({ ...newApplication, program: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-deadline">Application Deadline</Label>
                <Input
                  id="new-deadline"
                  type="date"
                  value={newApplication.deadline}
                  onChange={(e) => setNewApplication({ ...newApplication, deadline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-status">Initial Status</Label>
                <select
                  id="new-status"
                  className="w-full p-2 neo-border bg-background"
                  value={newApplication.status}
                  onChange={(e) => setNewApplication({ ...newApplication, status: e.target.value })}
                >
                  <option value="preparing">Preparing</option>
                  <option value="submitted">Submitted</option>
                  <option value="in-review">In Review</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={handleAddApplication} className="font-bold uppercase tracking-wider">
                <Plus className="w-4 h-4 mr-2" />
                Add Application
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)} className="font-bold uppercase tracking-wider">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Filters and Actions */}
        <div className="bg-card neo-border neo-shadow p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <select className="p-2 neo-border bg-background text-sm">
                <option>All Status</option>
                <option>Preparing</option>
                <option>Submitted</option>
                <option>In Review</option>
                <option>Accepted</option>
                <option>Rejected</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Calendar View
              </Button>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {applications.map((app) => {
            const StatusIcon = getStatusIcon(app.status);
            const daysUntilDeadline = getDaysUntilDeadline(app.deadline);

            return (
              <div key={app.id} className={cn("bg-card neo-border neo-shadow p-6", getPriorityColor(app.priority))}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-black uppercase tracking-wider neo-text-shadow-black">
                        {app.university}
                      </h3>
                      <div className={cn("px-3 py-1 text-xs font-bold uppercase tracking-wider neo-border", getStatusColor(app.status))}>
                        <StatusIcon className="w-3 h-3 mr-1 inline" />
                        {app.status.replace("-", " ")}
                      </div>
                    </div>
                    <p className="text-muted-foreground font-medium mb-1">{app.program}</p>
                    <p className="text-sm text-muted-foreground">{app.notes}</p>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-bold text-sm">{app.deadline}</span>
                    </div>
                    <div className={cn("text-sm font-bold",
                      daysUntilDeadline < 7 ? "text-destructive" :
                        daysUntilDeadline < 30 ? "text-accent" : "text-muted-foreground"
                    )}>
                      {daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` :
                        daysUntilDeadline === 0 ? "Due today" : "Overdue"}
                    </div>
                  </div>
                </div>

                {/* Requirements Progress */}
                <div className="mb-4">
                  <h4 className="font-bold uppercase tracking-wider text-sm mb-3">Requirements</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {Object.entries(app.requirements).map(([req, status]) => {
                      const reqStatus = getRequirementStatus(status);
                      const ReqIcon = reqStatus.icon;

                      return (
                        <div key={req} className="bg-background p-3 neo-border text-center">
                          <ReqIcon className={cn("w-6 h-6 mx-auto mb-2", reqStatus.color)} />
                          <p className="text-xs font-bold uppercase tracking-wider mb-1">
                            {req === "sop" ? "SOP" :
                              req === "lor" ? "LOR" :
                                req === "testScores" ? "Test Scores" :
                                  req.charAt(0).toUpperCase() + req.slice(1)}
                          </p>
                          <p className={cn("text-xs capitalize", reqStatus.color)}>
                            {status.replace("-", " ")}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Fee: <strong>{app.applicationFee}</strong></span>
                    {app.submittedDate && (
                      <span>Submitted: <strong>{app.submittedDate}</strong></span>
                    )}
                    <span className={cn("px-2 py-1 text-xs neo-border capitalize",
                      app.priority === "high" ? "bg-destructive/20 text-destructive" :
                        app.priority === "medium" ? "bg-accent/20 text-accent" :
                          "bg-muted/20 text-muted-foreground"
                    )}>
                      {app.priority} Priority
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  {app.status === "preparing" && (
                    <Button size="sm" className="font-bold uppercase tracking-wider">
                      <Send className="w-4 h-4 mr-2" />
                      Submit
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-card neo-border neo-shadow p-6">
          <h2 className="text-xl font-black uppercase tracking-wider mb-4 neo-text-shadow-black flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-accent" />
            Upcoming Deadlines
          </h2>
          <div className="space-y-3">
            {applications
              .filter(app => getDaysUntilDeadline(app.deadline) <= 30 && getDaysUntilDeadline(app.deadline) > 0)
              .sort((a, b) => getDaysUntilDeadline(a.deadline) - getDaysUntilDeadline(b.deadline))
              .map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 bg-background neo-border">
                  <div>
                    <p className="font-bold">{app.university} - {app.program}</p>
                    <p className="text-sm text-muted-foreground">{app.deadline}</p>
                  </div>
                  <div className={cn("font-bold text-sm",
                    getDaysUntilDeadline(app.deadline) < 7 ? "text-destructive" : "text-accent"
                  )}>
                    {getDaysUntilDeadline(app.deadline)} days left
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}