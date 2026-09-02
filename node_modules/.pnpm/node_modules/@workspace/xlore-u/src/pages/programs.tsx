import { useState } from "react";
import { useListPrograms, useSaveProgram, useUnsaveProgram, getListProgramsQueryKey, getGetSavedProgramsQueryKey } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Search, Bookmark, BookmarkCheck, Building, GraduationCap, Briefcase } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { Program } from "@workspace/api-client-react";

export default function ProgramsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [strandFilter, setStrandFilter] = useState("all");

  const { data: programs, isLoading } = useListPrograms();
  const queryClient = useQueryClient();
  const saveProgram = useSaveProgram();
  const unsaveProgram = useUnsaveProgram();
  const { toast } = useToast();

  const handleToggleSave = (programId: number, isSaved: boolean) => {
    const program = programs?.find(item => item.id === programId);
    const mutationOptions = {
      onSuccess: () => {
        queryClient.setQueryData<Program[] | undefined>(getListProgramsQueryKey(), current =>
          current?.map(item => item.id === programId ? { ...item, isSaved: !isSaved } : item)
        );
        queryClient.setQueryData<Program[] | undefined>(getGetSavedProgramsQueryKey(), current => {
          if (isSaved) return current?.filter(item => item.id !== programId);
          if (!program || current?.some(item => item.id === programId)) return current;
          return [...(current || []), { ...program, isSaved: true }];
        });
        queryClient.invalidateQueries({ queryKey: getListProgramsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetSavedProgramsQueryKey() });
        toast({ title: isSaved ? "Program removed" : "Program saved", description: isSaved ? "Removed from your saved items." : "Added to your saved programs." });
      },
      onError: (error: Error) => toast({ title: "Could not update saved items", description: error.message || "Please sign in and try again.", variant: "destructive" }),
    };
    if (isSaved) {
      unsaveProgram.mutate(
        { programId },
        mutationOptions
      );
    } else {
      saveProgram.mutate(
        { data: { programId } },
        mutationOptions
      );
    }
  };

  const filteredPrograms = programs?.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.schoolName.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (strandFilter !== "all" && p.strand !== strandFilter) return false;
    return true;
  });

  // Extract unique categories and strands for filters
  const categories = Array.from(new Set(programs?.map(p => p.category) || []));
  const strands = Array.from(new Set(programs?.map(p => p.strand) || []));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Academic Programs</h1>
        <p className="text-muted-foreground mt-2">Discover programs and specializations offered across Metro Manila</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search programs or schools..."
            className="pl-9 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="input-search-programs"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[180px] bg-background">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={strandFilter} onValueChange={setStrandFilter}>
          <SelectTrigger className="w-full md:w-[180px] bg-background">
            <SelectValue placeholder="Strand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Strands</SelectItem>
            {strands.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-80 rounded-xl" />)}
        </div>
      ) : filteredPrograms?.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl border border-dashed">
          <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground">No programs found</h3>
          <p className="text-muted-foreground">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredPrograms?.map(program => (
            <Card key={program.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="outline" className="mb-2 bg-background">{program.category}</Badge>
                    <CardTitle className="text-xl">{program.name}</CardTitle>
                    <div className="flex items-center text-muted-foreground text-sm mt-2">
                      <Building className="h-4 w-4 mr-1 shrink-0" />
                      <Link href={`/schools/${program.schoolId}`} className="hover:text-primary hover:underline truncate">
                        {program.schoolName}
                      </Link>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleSave(program.id, !!program.isSaved)}
                    disabled={saveProgram.isPending || unsaveProgram.isPending}
                    className={program.isSaved ? "text-primary hover:text-primary/80 bg-background/50" : "text-muted-foreground bg-background/50"}
                    data-testid={`btn-save-program-${program.id}`}
                  >
                    {program.isSaved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pt-4">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {program.description}
                </p>
                <div className="space-y-3">
                  {program.careerPaths.length > 0 && (
                    <div>
                      <div className="flex items-center text-sm font-semibold mb-1">
                        <Briefcase className="h-4 w-4 mr-1 text-primary" />
                        Career Paths
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {program.careerPaths.map(path => (
                          <Badge key={path} variant="secondary" className="text-xs font-normal">{path}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="bg-card border-t p-4 flex justify-between items-center">
                <div className="text-sm font-medium">Strand: <span className="text-primary">{program.strand}</span></div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/schools/${program.schoolId}`}>View School</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
