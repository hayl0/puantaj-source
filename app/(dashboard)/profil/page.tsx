"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;
  const userInitials = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || "U";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex items-center gap-6 p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-violet-500/10 border border-primary/10 backdrop-blur-sm">
        <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white font-bold">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user?.name}</h1>
          <p className="text-muted-foreground">{user?.email}</p>
          <div className="flex gap-2 mt-2">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
              {(user as any)?.role === 'admin' ? 'Yönetici' : 'Personel'}
            </span>
            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase">
              Aktif
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Kişisel Bilgiler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Ad Soyad</Label>
              <Input defaultValue={user?.name || ''} readOnly />
            </div>
            <div className="space-y-2">
              <Label>E-posta</Label>
              <Input defaultValue={user?.email || ''} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Telefon</Label>
              <Input placeholder="+90 5XX XXX XX XX" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Şifre İşlemleri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Mevcut Şifre</Label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <Label>Yeni Şifre</Label>
              <Input type="password" />
            </div>
            <Button className="w-full">Şifreyi Güncelle</Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
