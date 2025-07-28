"use server";

import db from "@/db/db";
import { z } from "zod";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Utilitaire pour valider un fichier image
const fileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size === 0 || file.type.startsWith("image/"),
    "File must be an image"
  );

// Schéma pour créer un produit
const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  image: fileSchema.refine((file) => file.size > 0, "Required"),
  stock: z.coerce.number().int().min(0),
  unit: z.enum(["PIECE", "KG", "GRAM", "LITER", "ML", "BUNCH"]),
  categoryId: z.string().uuid(),
});

// Schéma pour éditer un produit (image optionnelle)
const editSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  image: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size === 0 || file.type.startsWith("image/"),
      "File must be an image"
    ),
  stock: z.coerce.number().int().min(0),
  unit: z.enum(["PIECE", "KG", "GRAM", "LITER", "ML", "BUNCH"]),
  categoryId: z.string().uuid(),
});

// Fonction utilitaire pour générer le chemin de l'image
function getImagePath(file: File) {
  return `/products/${crypto.randomUUID()}-${file.name}`;
}

// Ajouter un produit
export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) return result.error.formErrors.fieldErrors;

  const data = result.data;

  // Vérifie que la catégorie existe
  const categoryExists = await db.category.findUnique({
    where: { id: data.categoryId },
  });
  if (!categoryExists) {
    return { categoryId: ["Invalid category."] };
  }

  // Enregistre l'image
  await fs.mkdir("public/products", { recursive: true });
  const imagePath = getImagePath(data.image);
  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await data.image.arrayBuffer())
  );

  await db.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      imagePath,
      stock: data.stock,
      unit: data.unit,
      categoryId: data.categoryId,
    },
  });

  revalidatePath("/products");
  redirect("/admin/products");
}

// Modifier un produit
export async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) return result.error.formErrors.fieldErrors;

  const data = result.data;

  const product = await db.product.findUnique({ where: { id } });
  if (!product) return notFound();

  let imagePath = product.imagePath;

  if (data.image && data.image.size > 0) {
    try {
      await fs.unlink(`public${product.imagePath}`);
    } catch (err) {
      console.warn("Image not found, skipping delete.");
    }

    imagePath = getImagePath(data.image);
    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    );
  }

  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      imagePath,
      stock: data.stock,
      unit: data.unit,
      categoryId: data.categoryId,
    },
  });

  revalidatePath("/products");
  redirect("/admin/products");
}

// Activer ou désactiver la disponibilité d’un produit
export async function toggleProductAvailability(
  id: string,
  isAvailableForPurchase: boolean
) {
  await db.product.update({ where: { id }, data: { isAvailableForPurchase } });
  revalidatePath("/products");
}

// Supprimer un produit
export async function deleteProduct(id: string) {
  const product = await db.product.delete({ where: { id } });
  if (!product) return notFound();

  try {
    await fs.unlink(`public${product.imagePath}`);
  } catch (err) {
    console.warn("Image already deleted.");
  }

  revalidatePath("/products");
}
