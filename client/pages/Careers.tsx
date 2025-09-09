import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Leaf,
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Briefcase,
  Upload,
  Send,
  Heart,
  Zap,
  Target,
  Coffee
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    coverLetter: '',
    resume: null as File | null
  });

  const jobOpenings = [
    {
      id: 1,
      title: "Senior Plant Care Specialist",
      department: "Plant Care",
      location: "Remote / On-site",
      type: "Full-time",
      salary: "₹6-9 LPA",
      description: "Lead our plant care team and develop care protocols for new plant varieties.",
      requirements: [
        "Bachelor's degree in Botany, Horticulture, or related field",
        "5+ years of professional plant care experience",
        "Strong knowledge of plant diseases and treatments",
        "Excellent communication and training skills"
      ],
      responsibilities: [
        "Develop and maintain plant care protocols",
        "Train junior staff on proper plant care techniques",
        "Conduct plant health assessments",
        "Collaborate with sourcing team on new varieties"
      ]
    },
    {
      id: 2,
      title: "Digital Marketing Manager",
      department: "Marketing",
      location: "Mumbai, India",
      type: "Full-time", 
      salary: "₹8-12 LPA",
      description: "Drive our digital presence and grow our online community of plant enthusiasts.",
      requirements: [
        "Bachelor's degree in Marketing or related field",
        "3+ years of digital marketing experience",
        "Experience with social media marketing",
        "Data-driven approach to marketing decisions"
      ],
      responsibilities: [
        "Develop and execute digital marketing strategies",
        "Manage social media channels and content",
        "Analyze marketing performance and ROI",
        "Collaborate with design team on campaigns"
      ]
    },
    {
      id: 3,
      title: "Logistics Coordinator",
      department: "Operations",
      location: "Delhi, India",
      type: "Full-time",
      salary: "₹4-6 LPA",
      description: "Ensure smooth and timely delivery of plants to our customers nationwide.",
      requirements: [
        "Bachelor's degree in Supply Chain or related field",
        "2+ years of logistics experience",
        "Strong organizational and problem-solving skills",
        "Experience with logistics software"
      ],
      responsibilities: [
        "Coordinate plant shipments and deliveries",
        "Manage relationships with shipping partners",
        "Track and optimize delivery performance",
        "Handle customer delivery inquiries"
      ]
    },
    {
      id: 4,
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Bangalore, India",
      type: "Full-time",
      salary: "₹5-8 LPA",
      description: "Help our customers succeed in their plant parent journey and build lasting relationships.",
      requirements: [
        "Bachelor's degree in any field",
        "2+ years of customer success experience",
        "Excellent communication and empathy skills",
        "Passion for plants and customer care"
      ],
      responsibilities: [
        "Provide expert plant care guidance to customers",
        "Handle customer inquiries and resolve issues",
        "Develop customer success programs",
        "Monitor customer satisfaction and retention"
      ]
    },
    {
      id: 5,
      title: "Software Engineer - Full Stack",
      department: "Technology",
      location: "Remote",
      type: "Full-time",
      salary: "₹10-15 LPA",
      description: "Build and enhance our e-commerce platform and customer experience tools.",
      requirements: [
        "Bachelor's degree in Computer Science or related field",
        "3+ years of full-stack development experience",
        "Experience with React, Node.js, and databases",
        "Strong problem-solving and collaboration skills"
      ],
      responsibilities: [
        "Develop and maintain web applications",
        "Implement new features and improvements",
        "Ensure application performance and security",
        "Collaborate with design and product teams"
      ]
    },
    {
      id: 6,
      title: "Sustainability Manager",
      department: "Sustainability",
      location: "Pune, India",
      type: "Full-time",
      salary: "₹7-10 LPA",
      description: "Lead our sustainability initiatives and environmental impact programs.",
      requirements: [
        "Master's degree in Environmental Science or related field",
        "3+ years of sustainability program experience",
        "Knowledge of environmental regulations",
        "Project management and reporting skills"
      ],
      responsibilities: [
        "Develop and implement sustainability strategies",
        "Monitor environmental impact and reporting",
        "Coordinate with suppliers on eco-friendly practices",
        "Lead carbon offset and waste reduction programs"
      ]
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance, mental wellness programs, and fitness allowances"
    },
    {
      icon: Zap,
      title: "Growth & Learning",
      description: "Learning budgets, conference attendance, and mentorship programs"
    },
    {
      icon: Coffee,
      title: "Work-Life Balance",
      description: "Flexible hours, remote work options, and unlimited PTO policy"
    },
    {
      icon: Target,
      title: "Impact & Purpose",
      description: "Meaningful work that makes a positive environmental and social impact"
    }
  ];

  const handleJobApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the application data to your backend
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Application submitted successfully! We\'ll get back to you soon.');
      setIsApplicationOpen(false);
      setApplicationData({
        name: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        coverLetter: '',
        resume: null
      });
    } catch (error) {
      alert('Failed to submit application. Please try again.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setApplicationData({...applicationData, resume: file});
    }
  };

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
              🚀 Join Our Growing Team
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground">
              Grow Your Career with GreenHaven
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join a passionate team dedicated to bringing the beauty of nature into every home. 
              We're looking for talented individuals who share our mission of making plant parenthood 
              accessible and successful for everyone.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg">
                View Open Positions
              </Button>
              <Button size="lg" variant="outline">
                Learn About Our Culture
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Why Work With Us?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join a company that values growth, sustainability, and meaningful impact
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                    <benefit.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Open Positions
            </h2>
            <p className="text-xl text-muted-foreground">
              Find your perfect role and help us grow the plant community
            </p>
          </div>
          
          <div className="space-y-6">
            {jobOpenings.map((job) => (
              <Card key={job.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>
                        <Badge variant="secondary">{job.department}</Badge>
                      </div>
                      <p className="text-muted-foreground">{job.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" onClick={() => setSelectedJob(job)}>
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{job.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <Badge variant="secondary">{job.department}</Badge>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{job.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{job.type}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DollarSign className="w-4 h-4" />
                                <span>{job.salary}</span>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-2">Job Description</h4>
                              <p className="text-muted-foreground">{job.description}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-2">Requirements</h4>
                              <ul className="space-y-1">
                                {job.requirements.map((req, index) => (
                                  <li key={index} className="text-muted-foreground text-sm">• {req}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-2">Responsibilities</h4>
                              <ul className="space-y-1">
                                {job.responsibilities.map((resp, index) => (
                                  <li key={index} className="text-muted-foreground text-sm">• {resp}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <Button 
                              className="w-full" 
                              onClick={() => {
                                setApplicationData({...applicationData, position: job.title});
                                setIsApplicationOpen(true);
                              }}
                            >
                              Apply for This Position
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        onClick={() => {
                          setApplicationData({...applicationData, position: job.title});
                          setIsApplicationOpen(true);
                        }}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form Dialog */}
      <Dialog open={isApplicationOpen} onOpenChange={setIsApplicationOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply for Position</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleJobApplication} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={applicationData.name}
                  onChange={(e) => setApplicationData({...applicationData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={applicationData.email}
                  onChange={(e) => setApplicationData({...applicationData, email: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={applicationData.phone}
                  onChange={(e) => setApplicationData({...applicationData, phone: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="position">Position *</Label>
                <Select 
                  value={applicationData.position} 
                  onValueChange={(value) => setApplicationData({...applicationData, position: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobOpenings.map(job => (
                      <SelectItem key={job.id} value={job.title}>{job.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="experience">Years of Experience *</Label>
              <Select 
                value={applicationData.experience} 
                onValueChange={(value) => setApplicationData({...applicationData, experience: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">0-1 years</SelectItem>
                  <SelectItem value="2-3">2-3 years</SelectItem>
                  <SelectItem value="4-5">4-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="resume">Resume/CV *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  required
                />
                <label htmlFor="resume" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {applicationData.resume ? applicationData.resume.name : "Click to upload resume (PDF, DOC, DOCX)"}
                  </p>
                </label>
              </div>
            </div>
            
            <div>
              <Label htmlFor="coverLetter">Cover Letter</Label>
              <Textarea
                id="coverLetter"
                value={applicationData.coverLetter}
                onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                placeholder="Tell us why you're interested in this position and what you can bring to our team..."
                rows={4}
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => setIsApplicationOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Send className="w-4 h-4 mr-2" />
                Submit Application
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Company Culture */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Our Culture & Values
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  At GreenHaven, we believe that our team is our greatest asset. We've built a culture 
                  that encourages growth, creativity, and collaboration while maintaining a healthy 
                  work-life balance.
                </p>
                <p>
                  Our diverse team brings together passionate individuals from various backgrounds, 
                  united by our shared mission to make plant parenthood successful for everyone.
                </p>
                <p>
                  We offer competitive compensation, comprehensive benefits, and most importantly, 
                  the opportunity to make a positive impact on people's lives and the environment.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Team Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">4.8/5</div>
                  <div className="text-sm text-muted-foreground">Employee Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">95%</div>
                  <div className="text-sm text-muted-foreground">Retention Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">6</div>
                  <div className="text-sm text-muted-foreground">Office Locations</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop"
                alt="Team collaboration"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
