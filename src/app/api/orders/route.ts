import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, address, notes, items } = body;

    if (!name || !email || !address || !items?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user is already authenticated
    const supabase = await createClient();
    const {
      data: { user: existingUser },
    } = await supabase.auth.getUser();

    let userId = existingUser?.id;
    let newAccount = false;

    // If not authenticated, create new account
    if (!userId) {
      if (!password || password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }

      // Check if email already exists
      const { data: existingProfile } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("email", email)
        .single();

      if (existingProfile) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please log in first." },
          { status: 400 }
        );
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { name, role: "customer" },
        });

      if (authError || !authData.user) {
        return NextResponse.json(
          { error: authError?.message || "Failed to create account" },
          { status: 500 }
        );
      }

      userId = authData.user.id;
      newAccount = true;

      // Create profile
      await supabaseAdmin.from("profiles").insert({
        id: userId,
        name,
        email,
        address,
        role: "customer",
      });
    } else {
      // Update address for existing user
      await supabaseAdmin
        .from("profiles")
        .update({ address, name })
        .eq("id", userId);
    }

    // Validate items and fetch prices from DB
    const productIds = items.map((i: { product_id: string }) => i.product_id);
    const variantIds = items.map((i: { variant_id: string }) => i.variant_id);

    const { data: products } = await supabaseAdmin
      .from("products")
      .select("id, price")
      .in("id", productIds);

    const { data: variants } = await supabaseAdmin
      .from("product_variants")
      .select("id, product_id, stock_quantity")
      .in("id", variantIds);

    if (!products || !variants) {
      return NextResponse.json(
        { error: "Failed to validate products" },
        { status: 500 }
      );
    }

    // Build price map and validate stock
    const priceMap = new Map(products.map((p) => [p.id, p.price]));
    const variantMap = new Map(
      variants.map((v) => [v.id, v])
    );

    let total = 0;
    const orderItems: {
      product_id: string;
      variant_id: string;
      quantity: number;
      price: number;
    }[] = [];

    for (const item of items) {
      const price = priceMap.get(item.product_id);
      const variant = variantMap.get(item.variant_id);

      if (price === undefined || !variant) {
        return NextResponse.json(
          { error: "Invalid product or variant" },
          { status: 400 }
        );
      }

      if (variant.stock_quantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for one of your items` },
          { status: 400 }
        );
      }

      total += price * item.quantity;
      orderItems.push({
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        price,
      });
    }

    // Create order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_id: userId,
        total,
        shipping_address: address,
        notes: notes || null,
        status: "pending",
      })
      .select("id")
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Insert order items
    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(
        orderItems.map((item) => ({
          order_id: order.id,
          ...item,
        }))
      );

    if (itemsError) {
      // Cleanup: delete the order if items failed
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      return NextResponse.json(
        { error: "Failed to create order items" },
        { status: 500 }
      );
    }

    // Decrement stock for each variant
    for (const item of orderItems) {
      await supabaseAdmin.rpc("decrement_stock", {
        p_variant_id: item.variant_id,
        p_quantity: item.quantity,
      });
    }

    return NextResponse.json({
      orderId: order.id,
      newAccount,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
