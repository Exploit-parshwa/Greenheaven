import { Link } from "react-router-dom";
import {
  Leaf,
  Recycle,
  Truck,
  Factory,
  ArrowLeft,
  TreePine,
  Droplets,
  Sun,
  Package,
  Target,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function Sustainability() {
  const initiatives = [
    {
      icon: Package,
      title: "Eco-Friendly Packaging",
      description: "100% recyclable and biodegradable packaging materials",
      impact: "Zero plastic packaging since 2022"
    },
    {
      icon: Truck,
      title: "Carbon-Neutral Shipping",
      description: "All deliveries offset through verified carbon credit programs",
      impact: "10,000+ deliveries carbon-neutral this year"
    },
    {
      icon: Droplets,
      title: "Water Conservation",
      description: "Advanced irrigation systems and drought-resistant plant varieties",
      impact: "40% reduction in water usage"
    },
    {
      icon: TreePine,
      title: "Reforestation Partner",
      description: "One tree planted for every order through our forest partners",
      impact: "25,000+ trees planted to date"
    },
    {
      icon: Recycle,
      title: "Circular Economy",
      description: "Plant pot return program and upcycling initiatives",
      impact: "5,000+ pots recycled monthly"
    },
    {
      icon: Sun,
      title: "Renewable Energy",
      description: "Solar-powered facilities and green energy partnerships",
      impact: "100% renewable energy operations"
    }
  ];

  const goals = [
    {
      title: "Carbon Neutral by 2025",
      description: "Complete carbon neutrality across all operations",
      progress: 75,
      target: "Net-zero emissions"
    },
    {
      title: "Zero Waste Packaging",
      description: "Eliminate all non-biodegradable packaging materials",
      progress: 90,
      target: "100% biodegradable"
    },
    {
      title: "Water Efficiency",
      description: "50% reduction in water usage through smart irrigation",
      progress: 65,
      target: "50% reduction"
    },
    {
      title: "Local Sourcing",
      description: "80% of plants sourced from local, sustainable growers",
      progress: 60,
      target: "80% local sourcing"
    }
  ];

  const certifications = [
    {
      name: "USDA Organic",
      image: "https://via.placeholder.com/100x100/22c55e/ffffff?text=USDA",
      description: "Certified organic growing practices"
    },
    {
      name: "Carbon Trust",
      image: "https://via.placeholder.com/100x100/059669/ffffff?text=CT",
      description: "Carbon footprint certification"
    },
    {
      name: "B Corp Certified",
      image: "https://via.placeholder.com/100x100/0ea5e9/ffffff?text=B",
      description: "Social and environmental performance"
    },
    {
      name: "Sustainable Packaging",
      image: "https://via.placeholder.com/100x100/84cc16/ffffff?text=SP",
      description: "Eco-friendly packaging standards"
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
            
            <Link to="/" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-background to-emerald-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              🌍 Our Commitment to the Planet
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground">
              Sustainability at the Heart of Everything We Do
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We believe that bringing nature into your life shouldn't come at the expense of the planet. 
              That's why we've made sustainability our core mission, implementing eco-friendly practices 
              at every step of our journey.
            </p>
          </div>
        </div>
      </section>

      {/* Our Impact */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Our Environmental Impact
            </h2>
            <p className="text-xl text-muted-foreground">
              Measurable progress toward a greener future
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center space-y-2">
              <div className="text-4xl lg:text-5xl font-bold text-green-600">25K+</div>
              <div className="text-muted-foreground font-medium">Trees Planted</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl lg:text-5xl font-bold text-blue-600">40%</div>
              <div className="text-muted-foreground font-medium">Water Saved</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl lg:text-5xl font-bold text-purple-600">100%</div>
              <div className="text-muted-foreground font-medium">Renewable Energy</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl lg:text-5xl font-bold text-orange-600">Zero</div>
              <div className="text-muted-foreground font-medium">Plastic Packaging</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Initiatives */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Our Sustainability Initiatives
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive programs addressing every aspect of our environmental footprint
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initiatives.map((initiative, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <initiative.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{initiative.title}</h3>
                  <p className="text-muted-foreground">{initiative.description}</p>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {initiative.impact}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Goals */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Our 2025 Sustainability Goals
            </h2>
            <p className="text-xl text-muted-foreground">
              Ambitious targets with clear timelines and measurable outcomes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {goals.map((goal, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{goal.title}</span>
                    <Target className="w-5 h-5 text-primary" />
                  </CardTitle>
                  <p className="text-muted-foreground">{goal.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                  <Badge variant="outline" className="border-green-200 text-green-700">
                    Target: {goal.target}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Certifications & Partnerships
            </h2>
            <p className="text-xl text-muted-foreground">
              Third-party verified sustainability standards
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {certifications.map((cert, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="w-20 h-20 mx-auto">
                    <img 
                      src={cert.image}
                      alt={cert.name}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{cert.name}</h3>
                  <p className="text-sm text-muted-foreground">{cert.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lifecycle Approach */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Sustainable Plant Lifecycle
            </h2>
            <p className="text-xl text-muted-foreground">
              Environmental responsibility from seed to your home
            </p>
          </div>
          
          <div className="grid lg:grid-cols-5 gap-8">
            {[
              { title: "Growing", icon: Sun, description: "Organic practices, water conservation" },
              { title: "Packaging", icon: Package, description: "Biodegradable, plastic-free materials" },
              { title: "Shipping", icon: Truck, description: "Carbon-neutral delivery options" },
              { title: "Care", icon: Droplets, description: "Sustainable care instructions" },
              { title: "Return", icon: Recycle, description: "Pot recycling and plant rescue" }
            ].map((stage, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <stage.icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{stage.title}</h3>
                <p className="text-sm text-muted-foreground">{stage.description}</p>
                {index < 4 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-green-200 z-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
            <CardContent className="p-8 lg:p-12 text-center space-y-6">
              <Leaf className="w-16 h-16 mx-auto" />
              <h2 className="text-3xl lg:text-4xl font-bold">
                Join Our Sustainability Journey
              </h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                Every plant you purchase supports our environmental initiatives. Together, 
                we can create a greener, more sustainable future for generations to come.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Button size="lg" variant="secondary">
                  <Link to="/plants" className="flex items-center">
                    Shop Sustainable Plants
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  <Link to="/contact">Learn More</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
