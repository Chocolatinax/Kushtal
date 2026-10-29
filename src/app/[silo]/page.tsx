import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryPage } from "@/components/product/category-page";
import { findRoute, routePath } from "@/lib/catalog-routes";

// Se renderiza en cada visita (lee el catálogo de Supabase con la sesión).
// Solo existen las URLs de la arquitectura web: el resto da 404 en la página.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/[silo]">): Promise<Metadata> {
  const { silo } = await params;
  const route = findRoute([silo]);
  if (!route) return {};
  return {
    title: route.title,
    description: route.description,
    alternates: { canonical: routePath(route) },
    openGraph: { title: route.title, description: route.description, images: [route.image] },
  };
}

export default async function SiloPage({ params }: PageProps<"/[silo]">) {
  const { silo } = await params;
  const route = findRoute([silo]);
  if (!route) notFound();
  return <CategoryPage route={route} />;
}
