import { useState } from "react";
import { useSubmitAssessment, getGetAssessmentResultQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

const QUESTIONS = [
  {
    id: "interest",
    question: "What subject area excites you the most?",
    options: [
      "Technology & Computers",
      "Health & Medicine",
      "Business & Finance",
      "Arts & Design",
      "Education & Teaching",
      "Engineering & Construction"
    ]
  },
  {
    id: "skill",
    question: "What are you naturally good at?",
    options: [
      "Problem Solving",
      "Communication",
      "Creative Work",
      "Numbers & Analysis",
      "Helping Others",
      "Technical Work"
    ]
  },
  {
    id: "learning_style",
    question: "How do you prefer to learn?",
    options: [
      "Hands-on Practice",
      "Reading & Research",
      "Group Discussions",
      "Watching Demonstrations",
      "Independent Study"
    ]
  },
  {
    id: "budget",
    question: "What is your estimated annual tuition budget?",
    options: [
      "Under 15,000",
      "15,000-50,000",
      "50,000-150,000",
      "150,000+"
    ]
  },
  {
    id: "school_type",
    question: "Do you prefer Public or Private institutions?",
    options: [
      "Public (Government-funded)",
      "Private (Independent)",
      "No preference"
    ]
  },
  {
    id: "career_goal",
    question: "What is your long-term career goal?",
    options: [
      "Government & Public Service",
      "Business & Entrepreneurship",
      "Healthcare & Medicine",
      "Engineering & Technology",
      "Arts & Creative Industries",
      "Education & Academia"
    ]
  },
  {
    id: "strand",
    question: "What senior high school strand are you considering or from?",
    options: [
      "ABM (Accountancy, Business, Management)",
      "HUMSS (Humanities & Social Sciences)",
      "STEM (Science, Technology, Engineering, Math)",
      "ICT (Information & Communications Technology)",
      "GAS (General Academic Strand)",
      "TVL (Technical-Vocational-Livelihood)"
    ]
  },
  {
    id: "work_environment",
    question: "Which work environment sounds most motivating?",
    options: ["Technology & Computers", "Health & Medicine", "Business & Finance", "Arts & Design", "Education & Teaching", "Engineering & Construction"]
  },
  {
    id: "impact",
    question: "What kind of impact would you most like to make?",
    options: ["Helping Others", "Government & Public Service", "Business & Entrepreneurship", "Healthcare & Medicine", "Arts & Creative Industries", "Engineering & Technology"]
  },
  {
    id: "favorite_project",
    question: "Which project would you choose for a school showcase?",
    options: ["Build a useful app", "Design a brand campaign", "Research a community issue", "Create a health awareness project", "Design a building or product", "Teach a practical skill"]
  },
  {
    id: "decision_style",
    question: "How do you usually make important decisions?",
    options: ["Numbers & Analysis", "Problem Solving", "Communication", "Creative Work", "Helping Others", "Technical Work"]
  },
  {
    id: "strength",
    question: "Which strength do teachers and friends notice most?",
    options: ["Problem Solving", "Communication", "Creative Work", "Numbers & Analysis", "Helping Others", "Technical Work"]
  },
  {
    id: "pace",
    question: "What pace of work suits you best?",
    options: ["Hands-on Practice", "Reading & Research", "Group Discussions", "Watching Demonstrations", "Independent Study"]
  },
  {
    id: "community",
    question: "Which community challenge interests you most?",
    options: ["Digital access", "Public health", "Small business growth", "Sustainable design", "Better education", "Infrastructure and transport"]
  },
  {
    id: "subject",
    question: "Which class would you be happiest to take again?",
    options: ["Technology & Computers", "Health & Medicine", "Business & Finance", "Arts & Design", "Education & Teaching", "Engineering & Construction"]
  },
  {
    id: "collaboration",
    question: "What role do you naturally take in a team?",
    options: ["Problem Solving", "Communication", "Creative Work", "Numbers & Analysis", "Helping Others", "Technical Work"]
  },
  {
    id: "future_project",
    question: "What would you most like to build for your future?",
    options: ["A technology product", "A growing business", "A healthier community", "A creative portfolio", "A learning program", "A safer city"]
  },
  {
    id: "research",
    question: "Which question would you enjoy researching?",
    options: ["How can technology solve this?", "How can people be better supported?", "How can an organization grow?", "How can a design improve lives?", "How can communities learn?", "How can systems work more efficiently?"]
  },
  {
    id: "motivation",
    question: "What motivates you to keep learning?",
    options: ["Mastering a difficult problem", "Connecting with people", "Making something original", "Understanding how things work", "Making a difference", "Reaching a measurable goal"]
  },
  {
    id: "career_area",
    question: "Which career area are you most curious to explore?",
    options: ["Engineering & Technology", "Healthcare & Medicine", "Business & Entrepreneurship", "Arts & Creative Industries", "Education & Academia", "Government & Public Service"]
  }
];

export default function AssessmentPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const submitAssessment = useSubmitAssessment();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer
    }));

    submitAssessment.mutate(
      { data: { answers: formattedAnswers } },
      {
        onSuccess: (data) => {
          // Cache the result so the results page shows it immediately without a second fetch
          queryClient.setQueryData(getGetAssessmentResultQueryKey(), data);
          setLocation("/results");
        }
      }
    );
  };

  const currentQ = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;
  const canProceed = !!answers[currentQ.id];

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Academic Compass</h1>
        <p className="text-muted-foreground">Let's find the best schools and programs for you.</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium text-muted-foreground">
          <span>Question {step + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="border-border shadow-lg">
        <CardHeader className="bg-muted/20 pb-8">
          <CardTitle className="text-2xl leading-relaxed">{currentQ.question}</CardTitle>
          <CardDescription>Select the option that best describes you.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <RadioGroup
            value={answers[currentQ.id] ?? ""}
            onValueChange={(val) => setAnswers({ ...answers, [currentQ.id]: val })}
            className="space-y-3"
          >
            {currentQ.options.map((option, i) => (
              <div key={i} className="flex items-center space-x-3 space-y-0 p-4 border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                <RadioGroupItem value={option} id={`opt-${i}`} />
                <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer font-medium leading-relaxed">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-muted/10 p-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 0 || submitAssessment.isPending}
            className="w-24"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed || submitAssessment.isPending}
            className="w-32"
          >
            {submitAssessment.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : step === QUESTIONS.length - 1 ? (
              "Submit"
            ) : (
              <>Next <ArrowRight className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
