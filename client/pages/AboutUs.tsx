import { Link } from "react-router-dom";
import {
  Leaf,
  Heart,
  Shield,
  Truck,
  Star,
  Users,
  Globe,
  Award,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AboutUs() {
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b4a1?w=400&h=400&fit=crop&crop=face",
      bio: "Plant enthusiast with 15+ years in horticulture and sustainable business practices."
    },
    {
      name: "David Rodriguez",
      role: "Head of Plant Care",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      bio: "Certified botanist and plant care expert, ensuring every plant gets the best care."
    },
    {
      name: "Emma Thompson",
      role: "Sustainability Director",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      bio: "Environmental advocate focused on eco-friendly packaging and carbon-neutral operations."
    },
    {
      name: "Alex Kumar",
      role: "Customer Experience Lead",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      bio: "Dedicated to making every customer's plant journey successful and enjoyable."
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Plants",
      description: "We believe in the transformative power of plants to improve lives and spaces."
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Every plant is carefully selected, nurtured, and inspected before reaching you."
    },
    {
      icon: Globe,
      title: "Sustainability",
      description: "Committed to eco-friendly practices and carbon-neutral shipping."
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a community of plant lovers who support each other's growth."
    }
  ];

  const achievements = [
    { number: "50K+", label: "Happy Customers" },
    { number: "100K+", label: "Plants Delivered" },
    { number: "99%", label: "Satisfaction Rate" },
    { number: "500+", label: "Plant Varieties" }
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
      <section className="relative bg-gradient-to-br from-plant-sage/20 via-background to-plant-leaf/10 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <Badge className="bg-plant-leaf/20 text-plant-forest border-plant-leaf/30">
              🌿 About GreenHaven
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground">
              Bringing Nature to Your Doorstep
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Founded in 2018, GreenHaven has been on a mission to make plant parenthood accessible, 
              enjoyable, and successful for everyone. We believe every space deserves the beauty and 
              benefits of green life.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  It all started in a small apartment where our founder, Sarah, struggled to keep her first plant alive. 
                  After countless failed attempts and extensive research, she realized that plant care wasn't just about 
                  watering – it was about understanding each plant's unique needs.
                </p>
                <p>
                  Determined to help others avoid her early mistakes, Sarah began sharing her knowledge online. 
                  The overwhelmingly positive response showed her that many people shared the same struggles and 
                  dreams of creating green, living spaces.
                </p>
                <p>
                  Today, GreenHaven has grown from a passion project to a thriving community of plant enthusiasts. 
                  We've helped over 50,000 people successfully grow their plant collections, transforming homes 
                  and offices into vibrant, healthy environments.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop"
                alt="Plant nursery"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-plant-forest/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Our Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do at GreenHaven
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Our Impact
            </h2>
            <p className="text-xl text-muted-foreground">
              Numbers that reflect our commitment to excellence
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-4xl lg:text-5xl font-bold text-primary">
                  {achievement.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Passionate plant experts dedicated to your success
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6 space-y-3">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{member.name}</h3>
                    <p className="text-primary font-medium">{member.role}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-plant-sage/10 to-plant-leaf/10 border-plant-leaf/20">
            <CardContent className="p-8 lg:p-12 text-center space-y-6">
              <Award className="w-16 h-16 text-primary mx-auto" />
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Our Mission
              </h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                "To cultivate a world where everyone can experience the joy, beauty, and benefits of plant life. 
                We're committed to providing not just plants, but the knowledge, support, and community needed 
                to help every plant parent succeed in their green journey."
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Button asChild>
                  <Link to="/plants">
                    Shop Plants
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/contact">Get in Touch</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Awards & Recognition
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold">Best Plant Delivery 2023</h3>
                <p className="text-muted-foreground">Green Living Magazine</p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Eco-Friendly Business</h3>
                <p className="text-muted-foreground">Sustainable Commerce Awards</p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Customer Choice Award</h3>
                <p className="text-muted-foreground">Plant Parents Community</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
