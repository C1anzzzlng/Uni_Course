import { useGetSavedSchools, useGetSavedPrograms, useUnsaveSchool, useUnsaveProgram, getGetSavedSchoolsQueryKey, getGetSavedProgramsQueryKey, getListSchoolsQueryKey, getListProgramsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { useEffect } from "react";
import { useAuth } from "@clerk/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, BookOpen, Trash2, MapPin } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function SavedPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { data: savedSchools, isLoading: isLoadingSchools, refetch: refetchSchools } = useGetSavedSchools({ query: { queryKey: getGetSavedSchoolsQueryKey(), enabled: isLoaded && isSignedIn, refetchOnMount: "always" } });
  const { data: savedPrograms, isLoading: isLoadingPrograms, refetch: refetchPrograms } = useGetSavedPrograms({ query: { queryKey: getGetSavedProgramsQueryKey(), enabled: isLoaded && isSignedIn, refetchOnMount: "always" } });
  const queryClient = useQueryClient();
  const unsaveSchool = useUnsaveSchool();
  const unsaveProgram = useUnsaveProgram();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      void refetchSchools();
      void refetchPrograms();
    }
  }, [isLoaded, isSignedIn, refetchPrograms, refetchSchools]);

  const handleRemoveSchool = (id: number) => {
    unsaveSchool.mutate({ schoolId: id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSavedSchoolsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListSchoolsQueryKey() });
      }
    });
  };

  const handleRemoveProgram = (id: number) => {
    unsaveProgram.mutate({ programId: id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSavedProgramsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListProgramsQueryKey() });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Saved Items</h1>
        <p className="text-muted-foreground mt-2">Your bookmarked schools and programs for easy reference.</p>
      </div>

      <Tabs defaultValue="schools" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="schools">Saved Schools</TabsTrigger>
          <TabsTrigger value="programs">Saved Programs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schools" className="mt-6">
          {isLoadingSchools ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-xl" />)}
            </div>
          ) : savedSchools?.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-xl border border-dashed">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground">No saved schools</h3>
              <p className="text-muted-foreground mb-4">You haven't bookmarked any schools yet.</p>
              <Button asChild variant="outline"><Link href="/schools">Browse Schools</Link></Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedSchools?.map(school => (
                <Card key={school.id} className="flex flex-col min-w-0">
                  <CardHeader className="pb-3 flex-row items-start justify-between gap-2 space-y-0">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg leading-tight hover:text-primary transition-colors line-clamp-2 break-words">
                        <Link href={`/schools/${school.id}`}>{school.name}</Link>
                      </CardTitle>
                      <div className="flex items-center text-xs text-muted-foreground mt-2 min-w-0">
                        <MapPin className="h-3 w-3 mr-1 shrink-0" />
                        <span className="truncate">{school.address}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive shrink-0" onClick={() => handleRemoveSchool(school.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="programs" className="mt-6">
          {isLoadingPrograms ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-xl" />)}
            </div>
          ) : savedPrograms?.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-xl border border-dashed">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground">No saved programs</h3>
              <p className="text-muted-foreground mb-4">You haven't bookmarked any programs yet.</p>
              <Button asChild variant="outline"><Link href="/programs">Browse Programs</Link></Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedPrograms?.map(program => (
                <Card key={program.id} className="flex flex-col min-w-0">
                  <CardHeader className="pb-3 flex-row items-start justify-between gap-2 space-y-0">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg leading-tight line-clamp-2 break-words">{program.name}</CardTitle>
                      <div className="flex items-center text-xs font-medium text-primary mt-2 min-w-0 truncate">
                        <Link href={`/schools/${program.schoolId}`}>{program.schoolName}</Link>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive shrink-0" onClick={() => handleRemoveProgram(program.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <span className="text-xs bg-muted px-2 py-1 rounded-md">{program.category}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
