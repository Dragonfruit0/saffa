import Link from "next/link";
import { Linkedin, MessageCircle } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-muted/40" id="contact">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4 md:col-span-2">
            <Logo />
            <p className="text-muted-foreground max-w-md">
              Your one-stop platform to find, compare, and book the perfect Umrah and Hajj packages. We bring transparency and ease to your spiritual journey.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Link href="https://api.whatsapp.com/send/?phone=919908829096&text=I+came+from+Safamarwah.in&type=phone_number&app_absent=0" aria-label="WhatsApp">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <MessageCircle className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="https://www.linkedin.com/company/safamarwah/" aria-label="LinkedIn">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Linkedin className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/90">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="#packages" className="text-muted-foreground hover:text-foreground transition-colors">Packages</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/90">Newsletter</h3>
            <p className="mt-4 text-muted-foreground">Stay up to date with our latest packages and offers.</p>
            <form className="mt-4 flex gap-2">
              <Input type="email" placeholder="Enter your email" className="bg-background"/>
              <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0">Subscribe</Button>
            </form>
          </div>

        </div>
        <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SafaMarwah All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
