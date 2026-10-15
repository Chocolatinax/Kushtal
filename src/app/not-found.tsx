import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/badge";

export default function NotFound() {
  return (
    <div className="canvas grid min-h-[60vh] place-items-center py-16 text-center">
      <div className="max-w-md">
        <Eyebrow className="text-center">Error 404</Eyebrow>
        <h1 className="mt-3 font-display text-[32px] leading-10 font-semibold text-piedra md:text-[42px] md:leading-[52px]">
          Esta pieza no está en el taller
        </h1>
        <p className="mt-4 text-[15px] leading-6 text-ink-muted">
          La página que buscás no existe o la silueta salió de catálogo. Volvé a
          la colección y elegí tu próxima pieza.
        </p>
        <ButtonLink href="/coleccion" size="lg" className="mt-7">
          Ver la colección
        </ButtonLink>
      </div>
    </div>
  );
}
