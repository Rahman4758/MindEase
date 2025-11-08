import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
     try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });


    //if user not found

     if (response.status === 404) {
        alert("User not found. Redirecting to signup page...");
        navigate("/signup");
        return; }// stop further execution
   //if success
    const data = await response.json();
    console.log("data", data)
    if (response.ok) {
  localStorage.setItem("token", data.token); // <-- Token save karna zaroori
}

    if (!response.ok) {
      // Agar login galat hai ya backend error hai
      alert(data.message || "Login failed");
    } else {
      // Agar login sahi hai, token receive karo
      localStorage.setItem("token", data.token);
      navigate('/')
      // Yahan pe aap navigate("/dashboard") ya kisi page pe bhej sakte hain
    }
  } catch (err) {
    alert("Network error. Please try again.");
  }
    console.log("Login attempt:", { email, password });
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to continue your journey with MindEase</p>
        </div>

        {/* Login Form */}
        <Card className="p-8 shadow-xl border border-border/50">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Enter your password"
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
              Sign In
            </Button>

            <div className="text-center">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </Card>

        {/* Footer Message */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Your mental wellness journey matters. We're here to support you every step of the way.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;