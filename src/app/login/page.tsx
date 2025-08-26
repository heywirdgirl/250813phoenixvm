
// src/app/login/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase/clientApp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Ánh xạ mã lỗi Firebase sang thông báo thân thiện với người dùng
const getFirebaseAuthErrorMessage = (errorCode: string) => {
  switch (errorCode) {
    case "auth/invalid-email":
      return "Địa chỉ email không hợp lệ.";
    case "auth/user-disabled":
      return "Tài khoản người dùng này đã bị vô hiệu hóa.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Email hoặc mật khẩu không đúng.";
    case "auth/unauthorized-domain":
      return "Tên miền này không được phép để xác thực. Vui lòng kiểm tra lại cài đặt trong Bảng điều khiển Firebase của bạn và đảm bảo 'localhost' đã được thêm vào.";
    case "auth/invalid-api-key":
      return "Khóa API không hợp lệ. Vui lòng kiểm tra lại các giá trị trong tệp .env của bạn.";
    default:
      return "Đã xảy ra lỗi không xác định khi đăng nhập. Vui lòng thử lại.";
  }
};

// Component con chứa logic sử dụng useSearchParams
function LoginPageContent() {
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

  // Xử lý đăng nhập bằng email/mật khẩu
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        setError("Khóa API Firebase chưa được cấu hình. Vui lòng kiểm tra tệp .env của bạn.");
        setLoading(false);
        return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // useEffect sẽ xử lý chuyển hướng
    } catch (error: any) {
      console.error("Lỗi đăng nhập bằng email:", error.code, error.message);
      setError(getFirebaseAuthErrorMessage(error.code));
      setLoading(false);
    }
  };

  // Xử lý đăng nhập bằng Google
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        setError("Khóa API Firebase chưa được cấu hình. Vui lòng kiểm tra tệp .env của bạn.");
        setLoading(false);
        return;
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
      // useEffect sẽ xử lý chuyển hướng
    } catch (error: any) {
      console.error("Lỗi đăng nhập bằng Google:", error.code, error.message);
      setError(getFirebaseAuthErrorMessage(error.code));
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
        <form onSubmit={handleLogin}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Đăng nhập</CardTitle>
            <CardDescription>
              Nhập email của bạn dưới đây để đăng nhập vào tài khoản của bạn.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
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
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Đăng nhập thất bại</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
            {/* Tạm thời ẩn nút đăng nhập bằng Google để gỡ lỗi */}
            {/* 
            <Button
              className="w-full"
              variant="outline"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đăng nhập với Google"}
            </Button>
            */}
            <div className="mt-4 text-center text-sm">
              Bạn chưa có tài khoản?{' '}
              <Link href={`/signup?redirect=${redirect}`} className="underline">
                Đăng ký
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
