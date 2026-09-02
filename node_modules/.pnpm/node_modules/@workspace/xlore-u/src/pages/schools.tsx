import { useState } from "react";
import { useListSchools, useSaveSchool, useUnsaveSchool, getListSchoolsQueryKey, getGetSavedSchoolsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Search, MapPin, Building2, Bookmark, BookmarkCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { School } from "@workspace/api-client-react";

export default function SchoolsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [strandFilter, setStrandFilter] = useState<string>("all");

  const { data: schools, isLoading } = useListSchools();
  const queryClient = useQueryClient();
  const saveSchool = useSaveSchool();
  const unsaveSchool = useUnsaveSchool();
  const { toast } = useToast();

  const handleToggleSave = (schoolId: number, isSaved: boolean) => {
    const school = schools?.find(item => item.id === schoolId);
    const mutationOptions = {
      onSuccess: () => {
        queryClient.setQueryData<School[] | undefined>(getListSchoolsQueryKey(), current =>
          current?.map(item => item.id === schoolId ? { ...item, isSaved: !isSaved } : item)
        );
        queryClient.setQueryData<School[] | undefined>(getGetSavedSchoolsQueryKey(), current => {
          if (isSaved) return current?.filter(item => item.id !== schoolId);
          if (!school || current?.some(item => item.id === schoolId)) return current;
          return [...(current || []), { ...school, isSaved: true }];
        });
        queryClient.invalidateQueries({ queryKey: getListSchoolsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetSavedSchoolsQueryKey() });
        toast({ title: isSaved ? "Institution removed" : "Institution saved", description: isSaved ? "Removed from your saved items." : "Added to your saved institutions." });
      },
      onError: (error: Error) => toast({ title: "Could not update saved items", description: error.message || "Please sign in and try again.", variant: "destructive" }),
    };
    if (isSaved) {
      unsaveSchool.mutate(
        { schoolId },
        mutationOptions
      );
    } else {
      saveSchool.mutate(
        { data: { schoolId } },
        mutationOptions
      );
    }
  };

  const filteredSchools = schools?.filter(s => {
    if (search && !`${s.name} ${s.address} ${s.description || ""}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== "all" && s.type !== typeFilter) return false;
    if (strandFilter !== "all" && !s.strands.includes(strandFilter)) return false;
    return true;
  });

  const getInitials = (name: string) => {
    return name.split(" ").map(w => w[0]).join("").substring(0, 3).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">School Directory</h1>
        <p className="text-muted-foreground mt-2">Browse {schools?.length || 0} institutions across Metro Manila</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schools..."
            className="pl-9 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="input-search-schools"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full md:w-[180px] bg-background">
            <SelectValue placeholder="School Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Public">Public</SelectItem>
            <SelectItem value="Private">Private</SelectItem>
          </SelectContent>
        </Select>
        <Select value={strandFilter} onValueChange={setStrandFilter}>
          <SelectTrigger className="w-full md:w-[180px] bg-background">
            <SelectValue placeholder="Strand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Strands</SelectItem>
            <SelectItem value="STEM">STEM</SelectItem>
            <SelectItem value="ABM">ABM</SelectItem>
            <SelectItem value="HUMSS">HUMSS</SelectItem>
            <SelectItem value="ICT">ICT</SelectItem>
            <SelectItem value="GAS">GAS</SelectItem>
            <SelectItem value="TVL">TVL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : filteredSchools?.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl border border-dashed">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground">No schools found</h3>
          <p className="text-muted-foreground">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools?.map(school => (
            <div key={school.id} className="group relative flex flex-col justify-between rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    {school.logoUrl ? (
                      <img src={school.logoUrl} alt={school.name} className="w-12 h-12 rounded-md object-cover bg-background" />
                    ) : (
                      <div className={`w-12 h-12 rounded-md flex items-center justify-center font-bold text-white ${school.type === 'Public' ? 'bg-blue-600' : 'bg-indigo-600'}`}>
                        {getInitials(school.name)}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleToggleSave(school.id, !!school.isSaved); }}
                    disabled={saveSchool.isPending || unsaveSchool.isPending}
                    className={school.isSaved ? "text-primary hover:text-primary/80" : "text-muted-foreground"}
                    data-testid={`btn-save-school-${school.id}`}
                  >
                    {school.isSaved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                  </Button>
                </div>
                
                <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
                  <Link href={`/schools/${school.id}`}>
                    {school.name}
                  </Link>
                </h3>
                
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 mr-1 shrink-0" />
                  <span className="truncate">{school.address}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant={school.type === "Public" ? "default" : "secondary"}>
                    {school.type}
                  </Badge>
                  {school.strands.slice(0, 3).map(strand => (
                    <Badge variant="outline" key={strand}>{strand}</Badge>
                  ))}
                  {school.strands.length > 3 && (
                    <Badge variant="outline">+{school.strands.length - 3}</Badge>
                  )}
                </div>
                
              </div>
              <div className="p-4 border-t bg-muted/20 flex items-center justify-between mt-auto">
                <div className="text-sm font-medium">
                  {school.tuitionMax === 0 
                    ? "Free" 
                    : `₱${school.tuitionMin.toLocaleString()} - ₱${school.tuitionMax.toLocaleString()}`}
                </div>
                <Link href={`/schools/${school.id}`} className="text-sm font-semibold text-primary hover:underline">
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
