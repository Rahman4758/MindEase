import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
 const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
     setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
       const data = await response.json();

      if (!response.ok) {
        // Agar backend error bhej raha hai to setError me dikhayen
        setError(data.message || "Signup failed");
      } else {
        // Signup success, aap JWT token ya user data handle kar sakte hain
        // Jaise token ko save karna agar backend bhej raha hai
        localStorage.setItem("token", data.token);

        // Phir user ko login karwa ke dashboard ya login page pe bhej sakte hain
        navigate("/login"); // ya `/dashboard` agar turant login karwana hain
      }
      } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
    console.log("Signup attempt:", { name, email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center therapy-gradient p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Join MindEase</h1>
          <p className="text-muted-foreground">Start your journey towards better mental wellness</p>
        </div>

        {/* Signup Form */}
        <Card className="p-8 shadow-xl border border-border/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 bg-card/50 border-border/30 focus:ring-primary/20 focus:border-primary/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-card/50 border-border/30 focus:ring-primary/20 focus:border-primary/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-card/50 border-border/30 focus:ring-primary/20 focus:border-primary/50"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Create Account
            </Button>

            <div className="text-center">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </Card>

        {/* Footer Message */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Take the first step towards mindful self-reflection and emotional clarity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;