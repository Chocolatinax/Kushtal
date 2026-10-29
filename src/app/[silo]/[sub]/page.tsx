import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryPage } from "@/components/product/category-page";
import { CATALOG_ROUTES, findRoute, routePath } from "@/lib/catalog-routes";

// Solo existen las URLs de la arquitectura web; el resto da 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return CATALOG_ROUTES.filter((r) => r.segments.length === 2).map((r) => ({
    silo: r.segments[0],
    sub: r.segments[1],
  }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[silo]/[sub]">): Promise<Metadata> {
  const { silo, sub } = await params;
  const route = findRoute([silo, sub]);
  if (!route) return {};
  return {
    title: route.title,
    description: route.description,
    alternates: { canonical: routePath(route) },
    openGraph: { title: route.title, description: route.description, images: [route.image] },
  };
}

export default async function SubcategoryPage({
  params,
}: PageProps<"/[silo]/[sub]">) {
  const { silo, sub } = await params;
  const route = findRoute([silo, sub]);
  if (!route) notFound();
  return <CategoryPage route={route} />;
}
