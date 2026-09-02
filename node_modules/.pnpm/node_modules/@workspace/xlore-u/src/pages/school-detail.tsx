import { useParams } from "wouter";
import { useGetSchool, useSaveSchool, useUnsaveSchool, getGetSchoolQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Globe, Bookmark, BookmarkCheck, Banknote, ExternalLink, GraduationCap } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function SchoolDetailPage() {
  const params = useParams();
  const schoolId = parseInt(params.id || "0", 10);
  const { data: school, isLoading } = useGetSchool(schoolId, { query: { enabled: !!schoolId, queryKey: getGetSchoolQueryKey(schoolId) } });

  const queryClient = useQueryClient();
  const saveSchool = useSaveSchool();
  const unsaveSchool = useUnsaveSchool();
  const { toast } = useToast();

  if (isLoading || !school) {
    return (
      <div className="space-y-8 pb-10">
        <Skeleton className="h-44 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const handleToggleSave = () => {
    const mutationOptions = {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSchoolQueryKey(schoolId) });
        toast({ title: school.isSaved ? "Institution removed" : "Institution saved", description: school.isSaved ? "Removed from your saved items." : "Added to your saved institutions." });
      },
      onError: (error: Error) => toast({ title: "Could not update saved items", description: error.message || "Please sign in and try again.", variant: "destructive" }),
    };
    if (school.isSaved) {
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

  const addressQuery = encodeURIComponent(`${school.name}, ${school.address}, Metro Manila, Philippines`);
  const mapEmbedUrl = `https://maps.google.com/maps?q=${addressQuery}&output=embed`;
  const mapsDirectLink = `https://www.google.com/maps/search/?api=1&query=${addressQuery}`;

  return (
    <div className="space-y-6 pb-10">
      {/* Header card */}
      <div className="bg-card rounded-2xl border shadow-sm p-5 md:p-7">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div className="flex gap-4 items-start">
            {/* School logo / avatar */}
            {school.logoUrl ? (
              <img
                src={school.logoUrl}
                alt={`${school.name} logo`}
                className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-contain bg-white border p-1 shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.removeAttribute("style");
                }}
              />
            ) : null}
            <div
              className={`w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center font-black text-white shrink-0 text-xl ${school.type === "Public" ? "bg-blue-600" : "bg-indigo-600"}`}
              style={school.logoUrl ? { display: "none" } : undefined}
            >
              {school.name.substring(0, 2).toUpperCase()}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Badge variant={school.type === "Public" ? "default" : "secondary"}>
                  {school.type}
                </Badge>
                <Badge variant="outline">Metro Manila</Badge>
              </div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-foreground leading-tight">
                {school.name}
              </h1>
              <div className="flex items-start text-muted-foreground mt-1.5 text-sm gap-1">
                <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>{school.address}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-row sm:flex-col gap-2 shrink-0">
            <Button
              variant={school.isSaved ? "secondary" : "outline"}
              size="sm"
              onClick={handleToggleSave}
              disabled={saveSchool.isPending || unsaveSchool.isPending}
              className={school.isSaved ? "text-primary" : ""}
            >
              {school.isSaved
                ? <><BookmarkCheck className="h-4 w-4 mr-1.5" /> Saved</>
                : <><Bookmark className="h-4 w-4 mr-1.5" /> Save</>}
            </Button>
            {school.applicationUrl && (
              <Button size="sm" asChild>
                <a href={school.applicationUrl} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-1.5" />
                  Apply Now
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <section className="bg-card rounded-xl border p-5 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-foreground">About the School</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {school.description || "No description provided for this institution."}
            </p>
          </section>

          <section className="bg-card rounded-xl border p-5 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-foreground">Senior High Strands Accepted</h2>
            <div className="flex flex-wrap gap-2">
              {school.strands.map(strand => (
                <Badge key={strand} variant="outline" className="px-3 py-1 text-sm">
                  {strand}
                </Badge>
              ))}
            </div>
          </section>

          <section className="bg-card rounded-xl border p-5 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Programs Offered
            </h2>
            {school.programs && school.programs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {school.programs.map(program => (
                  <div key={program.id} className="p-4 border rounded-xl bg-background hover:border-primary/50 transition-colors">
                    <h3 className="font-semibold text-sm text-foreground leading-snug">{program.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{program.category} • {program.strand}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic text-sm">No detailed programs listed.</p>
            )}
          </section>
        </div>

        <div className="space-y-5">
          <div className="bg-card rounded-xl border p-5 shadow-sm">
            <h3 className="font-semibold flex items-center mb-3 text-sm">
              <Banknote className="h-4 w-4 mr-2 text-primary" />
              Tuition Range
            </h3>
            <p className="text-2xl font-bold text-foreground">
              {school.tuitionMax === 0
                ? "Free"
                : `₱${school.tuitionMin.toLocaleString()} – ₱${school.tuitionMax.toLocaleString()}`}
            </p>
            {school.tuitionMax > 0 && (
              <p className="text-xs text-muted-foreground mt-1">Per academic year (estimate)</p>
            )}
          </div>

          {/* Application links card */}
          <div className="bg-card rounded-xl border p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-sm">Applications & Links</h3>
            <div className="space-y-2">
              <a
                href={mapsDirectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full text-sm px-3 py-2.5 rounded-lg border hover:bg-accent transition-colors"
              >
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                Get Directions
              </a>
              {school.applicationUrl ? (
                <>
                  <a
                    href={school.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full text-sm px-3 py-2.5 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <Globe className="h-4 w-4 text-primary shrink-0" />
                    Visit Official Website
                  </a>
                  <a
                    href={school.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full text-sm px-3 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold"
                  >
                    <ExternalLink className="h-4 w-4 shrink-0" />
                    Apply Online
                  </a>
                </>
              ) : (
                <p className="text-xs text-muted-foreground italic px-1">No online application link available. Visit the school directly to apply.</p>
              )}
            </div>
          </div>

          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-1.5 text-sm font-semibold">
                <MapPin className="h-4 w-4 text-primary" />
                Location
              </div>
              <a
                href={mapsDirectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
              >
                <ExternalLink className="h-3 w-3" />
                Open in Maps
              </a>
            </div>
            <iframe
              key={mapEmbedUrl}
              title={`Location of ${school.name}`}
              width="100%"
              height="260"
              style={{ border: 0, display: "block" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={mapEmbedUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
