"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { ProductForm } from "./ProductForm";
import { productPhotos } from "@/lib/utils";
import { createProduct, updateProduct, deleteProduct } from "@/app/admin/actions";
import type { Product } from "@/types";

interface Props {
  products: Product[];
}

type EditTarget = Partial<Product> | null;

export function AdminProducts({ products: initial }: Props) {
  const [products, setProducts] = useState<Product[]>(initial);
  const [editing, setEditing] = useState<EditTarget>(null);
  const [isPending, startTransition] = useTransition();

  const handleAdd = async (data: {
    name: string; price: number; stock: number; description: string; images: string[];
  }) => {
    await createProduct(data);
    startTransition(() => {
      setProducts((ps) => [
        { id: "optimistic-" + Date.now(), slug: "", is_active: true, created_at: "", updated_at: "", ...data },
        ...ps,
      ]);
    });
  };

  const handleEdit = async (id: string, data: {
    name: string; price: number; stock: number; description: string; images: string[];
  }) => {
    await updateProduct(id, data);
    startTransition(() => {
      setProducts((ps) =>
        ps.map((p) => (p.id === id ? { ...p, ...data } : p))
      );
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
    startTransition(() => {
      setProducts((ps) => ps.filter((p) => p.id !== id));
    });
  };

  return (
    <div className="max-w-[1240px]">
      {/* Add button */}
      <button
        className="mb-[22px] w-full sm:w-auto inline-flex items-center justify-center border border-transparent rounded-[7px] px-5 py-3 text-[16px] font-semibold cursor-pointer transition-colors bg-accent text-white hover:bg-accent-dark"
        onClick={() => setEditing({})}
      >
        + Add Product
      </button>

      {/* Table wrapper */}
      <div className="overflow-x-auto min-[760px]:border min-[760px]:border-line min-[760px]:rounded-[6px]">
        <table className="w-full border-collapse text-[16px] min-[760px]:min-w-[760px]">
          {/* Desktop thead */}
          <thead className="hidden min-[760px]:table-header-group">
            <tr>
              {["Image", "Name", "Price (₦)", "Stock", "Description", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-[14px] border-b-2 border-line font-bold whitespace-nowrap"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => {
              const photos = productPhotos(p);
              return (
                <tr
                  key={p.id}
                  className={`
                    block border border-line rounded-[10px] p-[6px_16px] mb-[14px] bg-white
                    min-[760px]:table-row min-[760px]:border-none min-[760px]:rounded-none
                    min-[760px]:border-b min-[760px]:border-b-line/50 min-[760px]:mb-0 min-[760px]:p-0
                    ${i % 2 ? "min-[760px]:bg-[#f1f3f5]" : "min-[760px]:bg-white"}
                  `}
                >
                  {/* Image */}
                  <td
                    data-label="Image"
                    className="flex items-center justify-between gap-4 py-[11px] border-b border-line min-[760px]:table-cell min-[760px]:border-none min-[760px]:px-4 min-[760px]:py-[14px] min-[760px]:w-[100px] before:content-[attr(data-label)] before:flex-none before:text-left before:font-bold before:text-muted before:text-[14px] min-[760px]:before:content-none"
                  >
                    <div className="w-[72px] h-[72px] bg-[#111] rounded-[4px] overflow-hidden flex-none relative min-[760px]:w-[72px] min-[760px]:h-[60px]">
                      {photos[0] && (
                        <Image
                          src={photos[0]}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="72px"
                        />
                      )}
                    </div>
                  </td>

                  {/* Name */}
                  <td
                    data-label="Name"
                    className="flex items-center justify-between gap-4 py-[11px] border-b border-line text-right min-[760px]:table-cell min-[760px]:border-none min-[760px]:px-4 min-[760px]:py-[14px] min-[760px]:text-left before:content-[attr(data-label)] before:flex-none before:text-left before:font-bold before:text-muted before:text-[14px] min-[760px]:before:content-none"
                  >
                    {p.name}
                  </td>

                  {/* Price */}
                  <td
                    data-label="Price (₦)"
                    className="flex items-center justify-between gap-4 py-[11px] border-b border-line text-right min-[760px]:table-cell min-[760px]:border-none min-[760px]:px-4 min-[760px]:py-[14px] min-[760px]:text-left before:content-[attr(data-label)] before:flex-none before:text-left before:font-bold before:text-muted before:text-[14px] min-[760px]:before:content-none"
                  >
                    {Number(p.price).toLocaleString("en-NG")}
                  </td>

                  {/* Stock */}
                  <td
                    data-label="Stock"
                    className="flex items-center justify-between gap-4 py-[11px] border-b border-line text-right min-[760px]:table-cell min-[760px]:border-none min-[760px]:px-4 min-[760px]:py-[14px] min-[760px]:text-left before:content-[attr(data-label)] before:flex-none before:text-left before:font-bold before:text-muted before:text-[14px] min-[760px]:before:content-none"
                  >
                    {p.stock ?? 0}
                  </td>

                  {/* Description */}
                  <td
                    data-label="Description"
                    className="flex items-center justify-between gap-4 py-[11px] border-b border-line text-right text-[#333] min-[760px]:table-cell min-[760px]:border-none min-[760px]:px-4 min-[760px]:py-[14px] min-[760px]:text-left min-[760px]:max-w-[360px] before:content-[attr(data-label)] before:flex-none before:text-left before:font-bold before:text-muted before:text-[14px] min-[760px]:before:content-none"
                  >
                    {p.description}
                  </td>

                  {/* Actions */}
                  <td
                    data-label="Actions"
                    className="flex items-center justify-between gap-4 py-[11px] min-[760px]:table-cell min-[760px]:px-4 min-[760px]:py-[14px] min-[760px]:whitespace-nowrap before:content-[attr(data-label)] before:flex-none before:text-left before:font-bold before:text-muted before:text-[14px] min-[760px]:before:content-none"
                  >
                    <div className="flex gap-[10px]">
                      <button
                        className="inline-flex border border-transparent rounded-[6px] px-4 py-2 text-[14px] font-semibold cursor-pointer transition-colors bg-warning text-[#212529] hover:bg-warning-dark"
                        onClick={() => setEditing(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="inline-flex border border-transparent rounded-[6px] px-4 py-2 text-[14px] font-semibold cursor-pointer transition-colors bg-danger text-white hover:bg-danger-dark disabled:opacity-60"
                        onClick={() => handleDelete(p.id)}
                        disabled={isPending}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {products.length === 0 && (
              <tr className="block min-[760px]:table-row">
                <td
                  colSpan={6}
                  className="block text-center text-muted py-12 min-[760px]:table-cell"
                >
                  No products yet. Add your first product!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form modal */}
      {editing !== null && (
        <ProductForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={async (data) => {
            if (editing.id) {
              await handleEdit(editing.id, data);
            } else {
              await handleAdd(data);
            }
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
