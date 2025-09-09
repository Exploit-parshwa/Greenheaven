import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Leaf, 
  Sun, 
  Droplets, 
  Scissors, 
  Bug, 
  Thermometer,
  Calendar,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PlantCare() {
  const careGuides = [
    {
      category: "Indoor Plants",
      icon: Leaf,
      color: "bg-green-100 text-green-600",
      guides: [
        { name: "Monstera Deliciosa", difficulty: "Easy", time: "5 min read" },
        { name: "Snake Plant", difficulty: "Very Easy", time: "3 min read" },
        { name: "Fiddle Leaf Fig", difficulty: "Medium", time: "7 min read" },
        { name: "Pothos", difficulty: "Easy", time: "4 min read" }
      ]
    },
    {
      category: "Outdoor Plants",
      icon: Sun,
      color: "bg-yellow-100 text-yellow-600",
      guides: [
        { name: "Rose Care", difficulty: "Medium", time: "8 min read" },
        { name: "Lavender", difficulty: "Easy", time: "5 min read" },
        { name: "Japanese Maple", difficulty: "Hard", time: "10 min read" },
        { name: "Herbs Garden", difficulty: "Easy", time: "6 min read" }
      ]
    },
    {
      category: "Succulents",
      icon: Droplets,
      color: "bg-blue-100 text-blue-600",
      guides: [
        { name: "Jade Plant", difficulty: "Very Easy", time: "3 min read" },
        { name: "Echeveria", difficulty: "Easy", time: "4 min read" },
        { name: "Aloe Vera", difficulty: "Easy", time: "5 min read" },
        { name: "Christmas Cactus", difficulty: "Medium", time: "6 min read" }
      ]
    }
  ];

  const quickTips = [
    {
      icon: Droplets,
      title: "Watering",
      tip: "Most plants prefer to dry out slightly between waterings. Check soil moisture 1-2 inches deep.",
      level: "Beginner"
    },
    {
      icon: Sun,
      title: "Light Requirements",
      tip: "Bright, indirect light is ideal for most houseplants. Avoid direct sunlight which can scorch leaves.",
      level: "Beginner"
    },
    {
      icon: Thermometer,
      title: "Temperature",
      tip: "Most houseplants thrive in temperatures between 65-75°F (18-24°C) during the day.",
      level: "Intermediate"
    },
    {
      icon: Bug,
      title: "Pest Prevention",
      tip: "Inspect plants weekly for pests. Quarantine new plants for 2 weeks before introducing to your collection.",
      level: "Advanced"
    }
  ];

  const commonProblems = [
    {
      problem: "Yellow Leaves",
      causes: ["Overwatering", "Underwatering", "Natural aging", "Too much direct sun"],
      solutions: ["Check soil moisture", "Adjust watering schedule", "Remove yellow leaves", "Move to indirect light"]
    },
    {
      problem: "Brown Leaf Tips",
      causes: ["Low humidity", "Fluoride in water", "Overfertilization", "Dry air"],
      solutions: ["Increase humidity", "Use filtered water", "Reduce fertilizer", "Group plants together"]
    },
    {
      problem: "Drooping Leaves",
      causes: ["Underwatering", "Overwatering", "Root bound", "Temperature stress"],
      solutions: ["Check soil moisture", "Improve drainage", "Repot if needed", "Maintain consistent temperature"]
    },
    {
      problem: "No Growth",
      causes: ["Insufficient light", "Dormant season", "Nutrient deficiency", "Root bound"],
      solutions: ["Move to brighter location", "Wait for growing season", "Fertilize during growing season", "Repot with fresh soil"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">GreenHaven</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-2 text-muted-foreground">
              <span>/</span>
              <span>Plant Care Guide</span>
            </div>
          </div>
        </div>
      </header>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <BookOpen className="w-12 h-12 text-green-600 animate-bounce" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-fade-in-up">
            🌱 Complete Plant Care Guide
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Everything you need to know to keep your plants healthy and thriving. From basic care to advanced techniques, 
            our comprehensive guides will help you become a plant parent pro.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Expert Tips</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Problem Solving</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Seasonal Care</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="guides" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="guides">Care Guides</TabsTrigger>
              <TabsTrigger value="tips">Quick Tips</TabsTrigger>
              <TabsTrigger value="problems">Common Problems</TabsTrigger>
              <TabsTrigger value="seasonal">Seasonal Care</TabsTrigger>
            </TabsList>
            
            <TabsContent value="guides" className="mt-8">
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Plant Care Guides by Category
                </h2>
                
                {careGuides.map((category, index) => (
                  <Card key={category.category} className="animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                          <category.icon className="w-6 h-6" />
                        </div>
                        <span>{category.category}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {category.guides.map((guide) => (
                          <div key={guide.name} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                            <h4 className="font-semibold mb-2">{guide.name}</h4>
                            <div className="flex items-center justify-between text-sm">
                              <Badge variant={guide.difficulty === 'Very Easy' ? 'default' : guide.difficulty === 'Easy' ? 'secondary' : guide.difficulty === 'Medium' ? 'outline' : 'destructive'}>
                                {guide.difficulty}
                              </Badge>
                              <span className="text-muted-foreground">{guide.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="tips" className="mt-8">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Quick Care Tips
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {quickTips.map((tip, index) => (
                    <Card key={tip.title} className="animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <tip.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-lg">{tip.title}</h3>
                              <Badge variant="outline" className="text-xs">{tip.level}</Badge>
                            </div>
                            <p className="text-muted-foreground">{tip.tip}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="problems" className="mt-8">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Common Plant Problems & Solutions
                </h2>
                
                <div className="grid gap-6">
                  {commonProblems.map((item, index) => (
                    <Card key={item.problem} className="animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <AlertTriangle className="w-5 h-5 text-amber-500" />
                          <span>{item.problem}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-red-600 mb-3 flex items-center">
                              <Info className="w-4 h-4 mr-2" />
                              Common Causes
                            </h4>
                            <ul className="space-y-2">
                              {item.causes.map((cause, i) => (
                                <li key={i} className="flex items-center space-x-2 text-sm">
                                  <div className="w-2 h-2 bg-red-400 rounded-full" />
                                  <span>{cause}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-green-600 mb-3 flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Solutions
                            </h4>
                            <ul className="space-y-2">
                              {item.solutions.map((solution, i) => (
                                <li key={i} className="flex items-center space-x-2 text-sm">
                                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                                  <span>{solution}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="seasonal" className="mt-8">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Seasonal Plant Care Calendar
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      season: "Spring",
                      icon: "🌸",
                      color: "bg-pink-100 border-pink-200",
                      tasks: ["Start fertilizing", "Repot plants", "Increase watering", "Prune dead growth", "Propagate plants"]
                    },
                    {
                      season: "Summer",
                      icon: "☀️",
                      color: "bg-yellow-100 border-yellow-200",
                      tasks: ["Monitor water needs", "Provide shade for sensitive plants", "Watch for pests", "Regular fertilizing", "Harvest herbs"]
                    },
                    {
                      season: "Fall",
                      icon: "🍂",
                      color: "bg-orange-100 border-orange-200",
                      tasks: ["Reduce watering", "Stop fertilizing", "Bring plants indoors", "Prepare for dormancy", "Last pruning"]
                    },
                    {
                      season: "Winter",
                      icon: "❄️",
                      color: "bg-blue-100 border-blue-200",
                      tasks: ["Minimal watering", "Increase humidity", "Avoid cold drafts", "Reduce feeding", "Monitor for pests"]
                    }
                  ].map((season, index) => (
                    <Card key={season.season} className={`${season.color} animate-fade-in-up`} style={{animationDelay: `${index * 0.1}s`}}>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <span className="text-2xl">{season.icon}</span>
                          <span>{season.season}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {season.tasks.map((task, i) => (
                            <li key={i} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Need More Help?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-6">
            Our plant experts are here to help you succeed. Get personalized advice for your specific plants.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-white text-primary hover:bg-white/90">
              <Link to="/contact">Contact Our Experts</Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <Link to="/plants">Shop Plants</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
