// src/app/signup/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase/clientApp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Component con để sử dụng useSearchParams
function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(redirect);
    }
  }, [user, authLoading, router, redirect]);

  // Xử lý đăng ký bằng email/mật khẩu
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!auth) {
      setError("Firebase is not initialized.");
      setLoading(false);
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name,
        });
      }
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Xử lý đăng ký bằng Google
  const handleGoogleSignup = async () => {
    setLoading(true);
    setError(null);
    if (!auth) {
      setError("Firebase is not initialized.");
      setLoading(false);
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      // Không cần updateProfile vì Google tự động cung cấp displayName
      // Redirect sẽ được xử lý bởi useEffect
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (authLoading || user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex h-[calc(100vh-8rem)] items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSignup}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Signup Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
            <Button
              className="w-full"
              variant="outline"
              type="button"
              onClick={handleGoogleSignup}
              disabled={loading}
            >
              {loading ? "Processing..." : "Sign Up with Google"}
            </Button>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href={`/login?redirect=${redirect}`} className="underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

// Component chính bọc trong Suspense
export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}