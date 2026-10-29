import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut, Package } from "lucide-react";

import { signOut } from "@/app/actions/auth";
import { Badge, Eyebrow } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { getMyOrders, STATUS_LABELS } from "@/lib/db/orders";
import { formatDate, formatPriceUSD } from "@/lib/format";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Mi cuenta",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) redirect("/ingresar?next=/cuenta");

  const orders = await getMyOrders().catch(() => []);

  const name =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Patrón";

  const avatar = user.user_metadata?.avatar_url as string | undefined;

  return (
    <div className="canvas py-12 lg:py-16">
      <header className="flex flex-wrap items-center gap-5">
        {avatar ? (
          <Image
            src={avatar}
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 rounded-full border border-outline-variant object-cover"
          />
        ) : (
          <span className="grid h-14 w-14 place-items-center rounded-full bg-anil font-display text-xl font-semibold text-algodon">
            {name.charAt(0).toUpperCase()}
          </span>
        )}

        <div>
          <Eyebrow>Cuaderno de taller</Eyebrow>
          <h1 className="mt-1 font-display text-[28px] leading-9 font-semibold text-piedra md:text-[34px]">
            {name}
          </h1>
          <p className="mt-0.5 text-[13px] text-ink-muted">{user.email}</p>
        </div>

        <form action={signOut} className="ml-auto">
          <Button type="submit" variant="outline" size="sm">
            <LogOut size={14} strokeWidth={1.8} />
            Salir
          </Button>
        </form>
      </header>

      <section className="mt-12">
        <h2 className="font-display text-[26px] font-semibold text-piedra">
          Tus encargos
        </h2>

        {orders.length === 0 ? (
          <div className="mt-6 rounded-xl border border-outline-variant/70 bg-surface-lowest p-10 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-surface-high text-cafe">
              <Package size={20} strokeWidth={1.6} />
            </span>
            <p className="mt-4 font-display text-xl font-semibold text-piedra">
              Todavía no tienes pedidos
            </p>
            <p className="mt-2 text-[13px] text-ink-muted">
              Cuando configures tu primera pieza, aquí podrás seguir su paso
              por el taller.
            </p>
            <ButtonLink href="/coleccion" className="mt-6">
              Explorar la colección
            </ButtonLink>
          </div>
        ) : (
          <ul className="mt-6 flex flex-col gap-4">
            {orders.map((order) => {
              const status = STATUS_LABELS[order.status] ?? STATUS_LABELS.pending;

              return (
                <li
                  key={order.id}
                  className="rounded-xl border border-outline-variant/70 bg-surface-lowest p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="font-display text-lg font-semibold tracking-wider text-piedra">
                          {order.order_number}
                        </p>
                        <Badge
                          tone={order.status === "cancelled" ? "neutral" : "eco"}
                        >
                          {status.label}
                        </Badge>
                      </div>
                      <p className="mt-1 text-[13px] text-ink-muted">
                        {formatDate(order.created_at)} ·{" "}
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "pieza" : "piezas"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-display text-xl font-semibold text-piedra tabular-nums">
                        {formatPriceUSD(order.total_cents)}
                      </p>
                      <Link
                        href={`/pedido/${order.order_number}`}
                        className="mt-1 inline-block text-[13px] font-semibold text-anil link-underline"
                      >
                        Ver detalle
                      </Link>
                    </div>
                  </div>

                  <ul className="mt-5 flex flex-wrap gap-3 border-t border-outline-variant/60 pt-5">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex items-center gap-2.5">
                        {item.product_image && (
                          <Image
                            src={item.product_image}
                            alt=""
                            width={40}
                            height={50}
                            className="h-12 w-10 rounded-sm object-cover"
                          />
                        )}
                        <span className="text-[13px] text-ink-muted">
                          {item.product_name}
                          {item.quantity > 1 && ` ×${item.quantity}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
