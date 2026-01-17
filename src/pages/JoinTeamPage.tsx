import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Send, FileText, User, Mail, Phone, Briefcase, MessageSquare } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const rules = [
  {
    title: "1. Agreement Purpose",
    content: "This agreement defines the rules, responsibilities, and benefits for individuals joining Alphazero as team members. The journey starts with learning and contribution and may progress to paid professional projects based on performance and agency needs."
  },
  {
    title: "2. Member Status (Starting Phase)",
    content: "At the beginning, a member will join Alphazero as a Learning / Trial Team Member. During this phase, the member will observe workflows, assist with small tasks, and develop skills. No monthly salary or payment is guaranteed at this stage."
  },
  {
    title: "3. Professional Work Activation",
    content: "When Alphazero assigns a professional client project, the scope of work, deadline, and payment share will be clearly defined before starting. All work completed under Alphazero represents the agency and remains agency property."
  },
  {
    title: "4. Payment Distribution Rule (Fixed)",
    content: "For any paid client project acquired through Alphazero:\n• 70% of the client payment will be paid to the Team Member responsible for the work.\n• 30% of the payment will be retained by Alphazero.\nThe agency share covers client management, marketing, lead generation, revisions, operational costs, and business risk."
  },
  {
    title: "5. Client Ownership",
    content: "All clients obtained through Alphazero are the exclusive property of the agency. Team Members may work with clients but cannot claim ownership or establish independent agreements with them."
  },
  {
    title: "6. Agency Rights",
    content: "Alphazero reserves the right to showcase client work for portfolio, marketing, and promotional purposes, and to reassign or change team members on any project when necessary."
  },
  {
    title: "7. Team Member Benefits",
    content: "By being part of Alphazero, a team member gains real client experience, skill development, professional exposure, and permission to display completed work in their personal portfolio with proper agency credit."
  },
  {
    title: "8. Restrictions",
    content: "Team Members may not directly contact agency clients for personal work, sell agency projects under their own name, misuse the Alphazero brand, or present themselves as owners or partners of the agency."
  },
  {
    title: "9. Confidentiality",
    content: "All client information, files, pricing, and internal processes must remain confidential during and after association with Alphazero."
  },
  {
    title: "10. After Leaving the Agency",
    content: "After leaving Alphazero, a former team member may not work with previous Alphazero clients without written permission from the agency or a separate agreement."
  },
  {
    title: "11. Payment Clarity",
    content: "If a client fails to pay, the team member will not receive payment. Partial client payments will result in proportional payment to the team member. Failure to complete work or violation of rules may result in reduced or canceled payment."
  },
  {
    title: "12. Discipline & Professional Conduct",
    content: "Meeting deadlines, maintaining professional behavior, and following agency guidelines are mandatory. Violations may result in warnings or immediate removal from the team."
  },
  {
    title: "13. Agreement Termination",
    content: "Either party may terminate this agreement with a 7-day written notice. Any ongoing work must be properly handed over to Alphazero."
  },
  {
    title: "14. Final Declaration",
    content: "By signing below, both parties confirm that they have read, understood, and agreed to all terms and conditions stated in this agreement."
  }
];

const JoinTeamPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    skills: "",
    portfolio: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      toast({
        title: "Agreement Required",
        description: "Please read and agree to the team member agreement before submitting.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.fullName || !formData.email || !formData.skills) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Create mailto link with form data
    const subject = encodeURIComponent(`Team Application - ${formData.fullName}`);
    const body = encodeURIComponent(
      `Team Member Application\n\n` +
      `Full Name: ${formData.fullName}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone || 'Not provided'}\n` +
      `Skills: ${formData.skills}\n` +
      `Portfolio: ${formData.portfolio || 'Not provided'}\n\n` +
      `Message:\n${formData.message || 'No additional message'}\n\n` +
      `---\n` +
      `Applicant has agreed to all terms and conditions of the Team Member Agreement.`
    );

    window.location.href = `mailto:agency.alphazero@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Application Ready!",
        description: "Your email client has been opened. Please send the email to complete your application.",
      });
    }, 1000);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block"
            >
              Join Alphazero
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-display font-bold mb-6"
            >
              Become a <span className="gradient-text">Team Member</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              Read our team member agreement carefully and submit your application to join our creative family.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <FileText className="w-8 h-8 text-primary" />
              <h2 className="text-3xl lg:text-4xl font-display font-bold">
                Team Member Agreement
              </h2>
            </motion.div>

            <div className="space-y-6">
              {rules.map((rule, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-primary mb-3">{rule.title}</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{rule.content}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
                Submit Your Application
              </h2>
              <p className="text-muted-foreground">
                Fill out the form below and confirm that you agree to all terms and conditions.
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="space-y-6 p-8 rounded-2xl bg-secondary/30 border border-border"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User size={16} className="text-primary" />
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail size={16} className="text-primary" />
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Phone size={16} className="text-primary" />
                  Phone Number
                </label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+880 1XXX-XXXXXX"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Briefcase size={16} className="text-primary" />
                  Your Skills <span className="text-red-500">*</span>
                </label>
                <Input
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="e.g., Graphic Design, Video Editing, Web Development"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <ArrowRight size={16} className="text-primary" />
                  Portfolio Link
                </label>
                <Input
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  placeholder="https://your-portfolio.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare size={16} className="text-primary" />
                  Additional Message
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us why you want to join Alphazero..."
                  rows={4}
                />
              </div>

              {/* Agreement Checkbox */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border">
                <Checkbox
                  id="agreement"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  className="mt-1"
                />
                <label htmlFor="agreement" className="text-sm cursor-pointer">
                  <span className="font-semibold">I have read and agree to all 14 terms and conditions</span> of the Alphazero Team Member Agreement stated above. I understand my responsibilities, rights, and the payment structure.
                </label>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || !agreedToTerms}
                className="w-full gap-2"
              >
                {isSubmitting ? (
                  <>Preparing Application...</>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Application
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Your application will be sent to <strong>agency.alphazero@gmail.com</strong>
              </p>
            </motion.form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default JoinTeamPage;
