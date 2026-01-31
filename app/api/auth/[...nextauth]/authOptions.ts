import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare, hash } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  debug: true, // Enable debugging for Vercel logs
  // @ts-ignore
  trustHost: true, // Automatically trust Vercel host
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("--- AUTHORIZE START ---");
        console.log("Email:", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        const email = credentials.email.trim().toLowerCase();
        console.log("Processing email:", email);

        try {
          // --- AUTO-SEED & SELF-HEAL DEMO USERS ---
          if (email === 'admin@puantaj.com') {
            console.log("Checking Admin Demo User...");
            const existingAdmin = await prisma.user.findUnique({ where: { email } });
            
            if (!existingAdmin) {
              console.log("Seeding Demo Admin...");
              const hashedPassword = await hash('admin123', 10);
              const newAdmin = await prisma.user.create({
                data: {
                  email,
                  name: 'Demo Yönetici',
                  password: hashedPassword,
                  role: 'admin',
                  emailVerified: new Date(),
                }
              });
              console.log("Admin Seeded Successfully");
              return { id: newAdmin.id, email: newAdmin.email, name: newAdmin.name, role: newAdmin.role };
            } else {
              console.log("Admin Found. Checking Password...");
              // Self-Healing: Check if password matches, if not, reset it
              const isPasswordValid = await compare(credentials.password, existingAdmin.password);
              if (!isPasswordValid && credentials.password === 'admin123') {
                console.log("Fixing Demo Admin Password...");
                const hashedPassword = await hash('admin123', 10);
                const updatedAdmin = await prisma.user.update({
                  where: { email },
                  data: { password: hashedPassword }
                });
                return { id: updatedAdmin.id, email: updatedAdmin.email, name: updatedAdmin.name, role: updatedAdmin.role };
              } else if (isPasswordValid) {
                 console.log("Admin Password Valid");
                 return { id: existingAdmin.id, email: existingAdmin.email, name: existingAdmin.name, role: existingAdmin.role };
              }
            }
          }

          if (email === 'user@puantaj.com') {
             console.log("Checking Employee Demo User...");
             // Use findFirst to avoid potential unique constraint type issues if any
             const existingEmployee = await prisma.employee.findFirst({ where: { email } as any });
             
             if (!existingEmployee) {
               console.log("Seeding Demo Employee...");
               let admin = await prisma.user.findFirst({ where: { email: 'admin@puantaj.com' } });
               if (!admin) {
                 console.log("Admin not found for Employee Seed, creating Admin first...");
                 const adminPass = await hash('admin123', 10);
                 admin = await prisma.user.create({
                   data: { email: 'admin@puantaj.com', name: 'Demo Yönetici', password: adminPass, role: 'admin' }
                 });
               }
               
               const hashedPassword = await hash('demo123', 10);
               const newEmployee = await prisma.employee.create({
                 data: {
                   email,
                   name: 'Demo Personel',
                   password: hashedPassword,
                   userId: admin.id,
                   department: 'Yazılım',
                   position: 'Geliştirici',
                   salary: 0,
                   hireDate: new Date()
                 } as any
               });
               console.log("Employee Seeded Successfully");
               return { id: newEmployee.id, email: newEmployee.email!, name: newEmployee.name, role: 'personnel' };
             } else {
               console.log("Employee Found. Checking Password...");
               // Self-Healing: Check if password matches, if not, reset it
               const isPasswordValid = await compare(credentials.password, existingEmployee.password || '');
               if (!isPasswordValid && credentials.password === 'demo123') {
                 console.log("Fixing Demo Employee Password...");
                 const hashedPassword = await hash('demo123', 10);
                 const updatedEmployee = await prisma.employee.update({
                   where: { id: existingEmployee.id },
                   data: { password: hashedPassword } as any
                 });
                 return { id: updatedEmployee.id, email: updatedEmployee.email!, name: updatedEmployee.name, role: 'personnel' };
               } else if (isPasswordValid) {
                  console.log("Employee Password Valid");
                  return { id: existingEmployee.id, email: existingEmployee.email!, name: existingEmployee.name, role: 'personnel' };
               }
             }
          }
          // -----------------------------------------------------------

          console.log("Checking Regular User...");
          // 1. Check User table (Admin/Company Owner)
          const user = await prisma.user.findUnique({
            where: { email }
          });

          if (user) {
            console.log("User Found:", user.email);
            const isPasswordValid = await compare(credentials.password, user.password);
            if (isPasswordValid) {
              // Check verification
              if (!user.emailVerified) {
                throw new Error("Lütfen email adresinizi doğrulayın.");
              }

              console.log("User Password Valid");
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role, // 'admin' or 'user'
              };
            } else {
                console.log("User Password Invalid");
            }
          } else {
              console.log("User NOT Found in User table");
          }

          console.log("Checking Employee Table...");
          // 2. Check Employee table (Personnel)
          // Using findFirst instead of findUnique to be safe with nullable fields
          const employee = await prisma.employee.findFirst({
            where: { email } as any
          });

          if (employee && employee.password) {
            console.log("Employee Found:", employee.email);
            const isPasswordValid = await compare(credentials.password, employee.password);
            if (isPasswordValid) {
              // Check verification
              // Enforce verification only for employees created after the feature launch (2026-01-31)
              const FEATURE_LAUNCH_DATE = new Date('2026-01-31T18:00:00Z');
              if (!employee.emailVerified && employee.createdAt > FEATURE_LAUNCH_DATE) {
                throw new Error("Lütfen email adresinizi doğrulayın.");
              }

              console.log("Employee Password Valid");
              return {
                id: employee.id,
                email: employee.email!,
                name: employee.name,
                role: "personnel", // Distinct role for employees
              };
            } else {
                console.log("Employee Password Invalid");
            }
          } else {
              console.log("Employee NOT Found or No Password");
          }
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }

        console.log("--- AUTHORIZE END (NULL) ---");
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
