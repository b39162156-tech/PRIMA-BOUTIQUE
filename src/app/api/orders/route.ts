import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: Request) {
  const body = await request.json();
  const { customerName, customerPhone, customerAddress, deliveryZone, deliveryFee, paymentMethod, items } = body;

  if (!customerName || !customerPhone || !paymentMethod || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const subtotal = items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
  const total = subtotal + (deliveryFee || 0);

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      order_number: generateOrderNumber(),
      user_id: user?.id ?? null,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_address: customerAddress ?? null,
      delivery_zone: deliveryZone,
      delivery_fee: deliveryFee,
      payment_method: paymentMethod,
      subtotal,
      total,
      status: "en_attente",
    })
    .select()
    .single();

  if (error || !order) {
    return NextResponse.json({ error: error?.message || "Erreur lors de la création de la commande." }, { status: 500 });
  }

  const orderItems = items.map((i: any) => ({
    order_id: order.id,
    product_id: i.productId,
    product_name: i.name,
    unit_price: i.price,
    quantity: i.quantity,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  return NextResponse.json({ order });
}
