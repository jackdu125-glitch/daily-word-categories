import { notFound } from "next/navigation";
import { getGuides } from "@/lib/community-data";
import TodayGuidePage from "../today/page";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const guides = await getGuides();
  return guides.map((guide) => ({ slug: guide.slug }));
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;

  if (slug === "today") {
    return <TodayGuidePage />;
  }

  notFound();
}
