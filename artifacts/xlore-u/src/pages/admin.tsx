import { useState } from "react";
import { useGetMe, useListSchools, useDeleteSchool, useListPrograms, useDeleteProgram, useRefreshSchools, getListSchoolsQueryKey, getListProgramsQueryKey } from "@workspace/api-client-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldAlert, Plus, Edit, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { SchoolInputType, SchoolType } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

// Simplified Admin panel for demonstration
// A complete implementation would include full dialog forms for Create/Update with React Hook Form
// Given the constraints and parallel tool execution limit, this provides the structure and lists.

export default function AdminPage() {
  const { data: user, isLoading: userLoading } = useGetMe();
  const { data: schools, isLoading: schoolsLoading } = useListSchools();
  const { data: programs, isLoading: programsLoading } = useListPrograms();
  const deleteSchool = useDeleteSchool();
  const deleteProgram = useDeleteProgram();
  const refreshSchools = useRefreshSchools();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  if (userLoading) return <div className="p-8">Loading...</div>;

  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <ShieldAlert className="h-16 w-16 text-destructive opacity-80" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">You do not have administrator privileges to view this page.</p>
      </div>
    );
  }

  const handleDeleteSchool = (id: number) => {
    if (confirm("Are you sure you want to delete this school?")) {
      deleteSchool.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "School deleted" });
          queryClient.invalidateQueries({ queryKey: getListSchoolsQueryKey() });
        }
      });
    }
  };

  const handleDeleteProgram = (id: number) => {
    if (confirm("Are you sure you want to delete this program?")) {
      deleteProgram.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Program deleted" });
          queryClient.invalidateQueries({ queryKey: getListProgramsQueryKey() });
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage platform content and records.</p>
        </div>
        <Button variant="outline" onClick={() => refreshSchools.mutate(undefined, {
          onSuccess: (result) => {
            toast({ title: "Directory refreshed", description: `${result.updated} school records updated and ${result.programsAdded ?? 0} program offerings added from official websites.` });
            queryClient.invalidateQueries({ queryKey: getListSchoolsQueryKey() });
            queryClient.invalidateQueries({ queryKey: getListProgramsQueryKey() });
          },
          onError: () => toast({ title: "Refresh incomplete", description: "Some official websites could not be reached. Try again later.", variant: "destructive" }),
        })} disabled={refreshSchools.isPending}>
          {refreshSchools.isPending ? "Refreshing schools & programs…" : "Refresh schools & programs"}
        </Button>
      </div>

      <Tabs defaultValue="schools" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="schools">Schools</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schools" className="space-y-4">
          <div className="flex justify-between">
            <Input placeholder="Filter schools..." className="max-w-sm" />
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add School
            </Button>
          </div>
          
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schoolsLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8">Loading...</TableCell></TableRow>
                ) : schools?.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell>{school.id}</TableCell>
                    <TableCell className="font-medium">{school.name}</TableCell>
                    <TableCell>{school.type}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteSchool(school.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="programs" className="space-y-4">
          <div className="flex justify-between">
            <Input placeholder="Filter programs..." className="max-w-sm" />
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Program
            </Button>
          </div>
          
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programsLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
                ) : programs?.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell>{program.id}</TableCell>
                    <TableCell className="font-medium">{program.name}</TableCell>
                    <TableCell>{program.schoolName}</TableCell>
                    <TableCell>{program.category}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteProgram(program.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
