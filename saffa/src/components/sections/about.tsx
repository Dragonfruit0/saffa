import Image from "next/image";
import { CheckCircle } from "lucide-react";

export function About() {
  const features = [
    { name: "Transparent Comparison", description: "Easily compare package prices, amenities, and itineraries side-by-side." },
    { name: "AI-Powered Recommendations", description: "Get personalized suggestions based on your unique preferences and budget." },
    { name: "Verified Providers", description: "We partner with trusted and reputable travel agencies to ensure your peace of mind." },
    { name: "All-in-One Platform", description: "From flights to accommodation, find everything you need for your journey in one place." },
  ];

  return (
    <section id="about" className="py-16 lg:py-24 bg-background">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-80 md:h-full w-full rounded-lg overflow-hidden shadow-lg">
            <Image
              src="https://picsum.photos/seed/about/800/600"
              alt="Pilgrims at a holy site"
              data-ai-hint="pilgrimage crowd"
              fill
              className="object-cover"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
          </div>
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">Our Mission</span>
            <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tight mt-2">
              Facilitating Your Spiritual Journey
            </h2>
            <p className="mt-4 text-muted-foreground">
              SafaMarwah was born from a simple idea: to make the sacred journey of Umrah and Hajj accessible and transparent for everyone. We believe that planning your pilgrimage should be a stress-free experience, allowing you to focus on what truly matters.
            </p>
            <ul className="mt-6 space-y-4">
              {features.map((feature) => (
                <li key={feature.name} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold">{feature.name}</h4>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
