import { Link } from "wouter";
import { ArrowRight, GraduationCap, Map, BookOpen, Compass } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="px-6 py-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-primary leading-none">X</span>
          <span className="text-xl font-bold text-foreground">Xlore U</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            data-testid="link-sign-in"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            data-testid="link-sign-up"
          >
            Get Started
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col">
        <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-background to-muted/30">
          <div className="max-w-3xl space-y-8">
            <h1 className="text-5xl md:text-6xl font-extrabold text-foreground tracking-tight">
              The Future is in Your Hands
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover the right senior high school program across Metro Manila. Match your skills, budget, and dreams to the right academic institution.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                href="/sign-up"
                className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-200"
                data-testid="btn-hero-signup"
              >
                Find Your Match
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/schools"
                className="flex items-center gap-2 bg-card text-card-foreground border border-border px-8 py-4 rounded-full font-semibold text-lg hover:bg-muted transition-colors shadow-sm"
                data-testid="btn-hero-explore"
              >
                Explore Schools
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-card border-t border-b">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <h3 className="text-4xl font-bold text-primary">22+</h3>
              <p className="text-lg font-medium text-foreground">Partner Schools</p>
              <p className="text-muted-foreground text-sm">A growing directory of institutions across Metro Manila.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl font-bold text-primary">37+</h3>
              <p className="text-lg font-medium text-foreground">Unique Programs</p>
              <p className="text-muted-foreground text-sm">Spanning across all major academic strands.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl font-bold text-primary">100%</h3>
              <p className="text-lg font-medium text-foreground">Free to Use</p>
              <p className="text-muted-foreground text-sm">Accessible guidance for every student.</p>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-background">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16 text-foreground">How Xlore U Guides You</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <Compass className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Self Assessment</h3>
                <p className="text-muted-foreground">Take our quick quiz to match your skills, interests, and budget with recommended programs.</p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">School Directory</h3>
                <p className="text-muted-foreground">Browse comprehensive profiles of 100+ Metro Manila institutions with tuition, locations, and programs.</p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <Map className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Interactive Map</h3>
                <p className="text-muted-foreground">Visualize your commute and find institutions closest to your home across Metro Manila.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        <p>&copy; {new Date().getFullYear()} Xlore U. Academic compass for Metro Manila.</p>
      </footer>
    </div>
  );
}
