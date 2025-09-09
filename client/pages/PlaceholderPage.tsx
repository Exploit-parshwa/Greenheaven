import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Leaf } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">GreenHaven</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          <div className="bg-muted/50 rounded-2xl p-12 space-y-6">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <Leaf className="w-12 h-12 text-primary" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Coming Soon!
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're working hard to bring you this section. In the meantime, explore our amazing plant collection!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back to Home
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/plants">
                  Browse Plants
                </Link>
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Want this page built? Continue prompting to have me implement the full functionality!
          </div>
        </div>
      </div>
    </div>
  );
}
