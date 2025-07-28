// lib/schemas.ts
import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(3, "Le nom est requis et doit contenir au moins 3 caractères."),
  price: z.coerce.number().min(0.01, "Le prix doit être supérieur à 0."), // Price in EUR
  filePath: z.string().min(1, "Le chemin du fichier est requis."),
  imagePath: z.string().min(1, "Le chemin de l'image est requis."),
  description: z.string().min(10, "La description est requise et doit contenir au moins 10 caractères."),
  isAvailableForPurchase: z.boolean().default(true),
  categoryId: z.string().min(1, "La catégorie est requise."),
})

export type ProductFormValues = z.infer<typeof productSchema>
