import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";

import { Badge, Eyebrow } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { getMyOrders, STATUS_LABELS } from "@/lib/db/orders";
import { formatDate, formatPriceUSD } from "@/lib/format";
import { getSavedAddress } from "@/lib/demo-session";

export const metadata: Metadata = {
  title: "Mis pedidos",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

/**
 * Demo sin inicio de sesión: muestra los pedidos confirmados en este
 * navegador (se recuerdan en una cookie al pagar).
 */
export default async function AccountPage() {
  const [orders, address] = await Promise.all([
    getMyOrders().catch(() => []),
    getSavedAddress(),
  ]);

  // El nombre sale de los datos de envío guardados, si los hay.
  const name = address
    ? `${address.first_name} ${address.last_name}`
    : "Mis pedidos";
  const email = address?.email ?? "Los pedidos que hagas en este navegador aparecen aquí.";

  return (
    <div className="canvas py-12 lg:py-16">
      <header className="flex flex-wrap items-center gap-5">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-anil font-display text-xl font-semibold text-algodon">
          {name.charAt(0).toUpperCase()}
        </span>

        <div>
          <Eyebrow>Cuaderno de taller</Eyebrow>
          <h1 className="mt-1 font-display text-[28px] leading-9 font-semibold text-piedra md:text-[34px]">
            {name}
          </h1>
          <p className="mt-0.5 text-[14px] sm:text-[13px] text-ink-muted">{email}</p>
        </div>
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
            <p className="mt-2 text-[14px] sm:text-[13px] text-ink-muted">
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
                      <p className="mt-1 text-[14px] sm:text-[13px] text-ink-muted">
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
                        href={`/pedido/${order.order_number}?t=${order.access_token}`}
                        className="mt-1 inline-block text-[14px] sm:text-[13px] font-semibold text-anil link-underline"
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
                        <span className="text-[14px] sm:text-[13px] text-ink-muted">
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
