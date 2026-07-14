import { AnnouncementBar } from "@/components/AnnouncementBar";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { BenefitsStrip } from "@/components/BenefitsStrip";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { Categories } from "@/components/Categories";
import { TrustSection } from "@/components/TrustSection";
import { AssistantPreview } from "@/components/AssistantPreview";
import { GiftRegistry } from "@/components/GiftRegistry";
import { ClubNewsletter } from "@/components/ClubNewsletter";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <BenefitsStrip />
        <FeaturedProducts />
        <Categories />
        <TrustSection />
        <AssistantPreview />
        <GiftRegistry />
        <ClubNewsletter />
      </main>
      <SiteFooter />
    </>
  );
}
