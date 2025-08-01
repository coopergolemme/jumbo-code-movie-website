import type React from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SignupForm from "@/components/auth/signup-form";
import SigninForm from "@/components/auth/signin-form";

export function AuthForm() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-indigo-900">
      <Card className="w-full max-w-md bg-gray-900/80 backdrop-blur-sm border-purple-500/30 shadow-2xl shadow-purple-500/20">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            🎬 JumboBoxd
          </CardTitle>
          <CardDescription className="text-gray-300 text-lg">
            Track your favorite movies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="signin"
            className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <SigninForm />
            </TabsContent>

            <TabsContent value="signup">
              <SignupForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
