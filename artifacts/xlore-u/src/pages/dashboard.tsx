import { useGetStats, useGetMe } from "@workspace/api-client-react";
import { Link } from "wouter";
import { GraduationCap, BookOpen, Compass, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export default function DashboardPage() {
  const { data: user, isLoading: userLoading } = useGetMe();
  const { data: stats, isLoading: statsLoading } = useGetStats();

  if (userLoading || statsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {user?.name || "Student"}
        </h1>
        <p className="text-muted-foreground text-lg">
          Your personalized academic compass for Metro Manila.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Schools</CardTitle>
            <GraduationCap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats?.totalSchools || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.publicSchools || 0} Public &middot; {stats?.privateSchools || 0} Private
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Programs</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats?.totalPrograms || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Across multiple strands</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary">Self Assessment</CardTitle>
            <Compass className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-foreground mb-2">Not sure where to start?</div>
            <Link
              href="/assessment"
              className="text-sm font-medium text-primary flex items-center hover:underline"
              data-testid="link-dashboard-assessment"
            >
              Take the quiz <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold mt-12 mb-4 text-foreground">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/schools"
          className="p-4 rounded-xl border bg-card hover:bg-accent hover:text-accent-foreground transition-colors group flex items-center justify-between shadow-sm"
          data-testid="quick-action-schools"
        >
          <span className="font-medium">Browse Schools</span>
          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        <Link
          href="/programs"
          className="p-4 rounded-xl border bg-card hover:bg-accent hover:text-accent-foreground transition-colors group flex items-center justify-between shadow-sm"
          data-testid="quick-action-programs"
        >
          <span className="font-medium">Explore Programs</span>
          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        <Link
          href="/compare"
          className="p-4 rounded-xl border bg-card hover:bg-accent hover:text-accent-foreground transition-colors group flex items-center justify-between shadow-sm"
          data-testid="quick-action-compare"
        >
          <span className="font-medium">Compare Options</span>
          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        <Link
          href="/map"
          className="p-4 rounded-xl border bg-card hover:bg-accent hover:text-accent-foreground transition-colors group flex items-center justify-between shadow-sm"
          data-testid="quick-action-map"
        >
          <span className="font-medium">View Map</span>
          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>
    </div>
  );
}
