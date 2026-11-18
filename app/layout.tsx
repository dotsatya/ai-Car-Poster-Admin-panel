import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";

export const metadata: Metadata = {
  title: "PosterGen Admin | Automotive Atelier",
  description: "Automotive poster generation and print management portal",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="dark h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
       <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
