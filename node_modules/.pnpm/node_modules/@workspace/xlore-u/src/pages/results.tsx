import { useGetAssessmentResult } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Building2, BookOpen, RotateCcw, Target, Banknote, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export default function ResultsPage() {
  const { data: result, isLoading } = useGetAssessmentResult();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-16 w-16 rounded-full mx-auto" />
          <Skeleton className="h-10 w-64 mx-auto" />
          <Skeleton className="h-5 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-64 rounded-xl" />
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
          <Target className="h-12 w-12 text-muted-foreground opacity-40" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">No Results Yet</h1>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            You haven't completed the self-assessment quiz yet. Take the quiz to get personalized school and program recommendations.
          </p>
        </div>
        <Button asChild size="lg" className="px-8 rounded-full">
          <Link href="/assessment">Take Assessment Now</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10 py-4">
      {/* Hero section */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-2">
          <Target className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Your Academic Match</h1>
        <p className="text-lg text-muted-foreground">
          Based on your responses, here are the programs and institutions across Metro Manila best aligned with your goals.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Badge variant="outline" className="px-3 py-1 text-sm">
            Completed {format(new Date(result.completedAt), "MMMM d, yyyy")}
          </Badge>
          <Button variant="outline" size="sm" asChild>
            <Link href="/assessment">
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Retake Assessment
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Programs */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
            <BookOpen className="h-5 w-5 text-primary" />
            Top Program Matches
          </h2>
          <Card className="border shadow-sm">
            <CardContent className="p-0">
              {result.recommendedPrograms.length > 0 ? (
                <ul className="divide-y divide-border">
                  {result.recommendedPrograms.map((program, idx) => (
                    <li key={idx} className="p-4 flex items-start gap-3">
                      <span className="flex items-center justify-center bg-primary/10 text-primary font-bold rounded-full w-6 h-6 text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-medium text-foreground text-sm">{program}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  No specific programs matched. Try retaking the assessment.
                </div>
              )}
            </CardContent>
          </Card>
          <div className="pt-2">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/programs">
                Browse All Programs <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Recommended Schools */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
            <Building2 className="h-5 w-5 text-primary" />
            Recommended Schools
          </h2>
          {result.matchedSchools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.matchedSchools.map(school => (
                <Card key={school.id} className="overflow-hidden hover:border-primary/40 transition-all hover:shadow-md group">
                  <div className="p-5 space-y-3">
                    <div className="flex items-start gap-3">
                      {school.logoUrl ? (
                        <img
                          src={school.logoUrl}
                          alt={`${school.name} logo`}
                          className="w-10 h-10 rounded-lg object-contain bg-white border p-0.5 shrink-0"
                          onError={e => { e.currentTarget.style.display = "none"; }}
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-white text-xs shrink-0 ${school.type === "Public" ? "bg-blue-600" : "bg-indigo-600"}`}>
                          {school.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <Badge variant={school.type === "Public" ? "default" : "secondary"} className="text-xs mb-1">
                          {school.type}
                        </Badge>
                        <h3 className="font-bold text-sm leading-snug text-foreground line-clamp-2">
                          {school.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-start text-xs text-muted-foreground gap-1">
                      <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{school.address}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <Banknote className="h-3.5 w-3.5 text-primary shrink-0" />
                      {school.tuitionMax === 0
                        ? "Free Tuition"
                        : `₱${school.tuitionMin.toLocaleString()} – ₱${school.tuitionMax.toLocaleString()}`}
                    </div>
                  </div>

                  <div className="px-5 py-3 bg-muted/20 border-t flex justify-between items-center">
                    <Link
                      href={`/schools/${school.id}`}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      View Profile <ArrowRight className="h-3 w-3" />
                    </Link>
                    {school.applicationUrl && (
                      <a
                        href={school.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        Apply →
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="col-span-full p-10 text-center border rounded-xl border-dashed bg-card space-y-3">
              <Building2 className="h-10 w-10 text-muted-foreground opacity-30 mx-auto" />
              <p className="text-muted-foreground">No schools matched your specific criteria.</p>
              <Button variant="outline" asChild>
                <Link href="/schools">Browse All Schools</Link>
              </Button>
            </div>
          )}

          {result.matchedSchools.length > 0 && (
            <div className="pt-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/schools">
                  Browse All Schools <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
