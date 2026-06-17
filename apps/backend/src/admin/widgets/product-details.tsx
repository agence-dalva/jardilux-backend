import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { useState, useEffect } from "react"
import { Button, Container, Heading, Label, toast } from "@medusajs/ui"
import RichTextEditor from "../components/rich-text-editor"

type DetailsState = {
  nettoyage: string
  details_technique: string
}

const ProductDetailsWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  const [state, setState] = useState<DetailsState>({
    nettoyage: "",
    details_technique: "",
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(
      `/admin/products/${data.id}?fields=+product_details.nettoyage,+product_details.details_technique`,
      { credentials: "include" }
    )
      .then((r) => r.json())
      .then(({ product }) => {
        const details = Array.isArray(product.product_details)
          ? product.product_details[0]
          : product.product_details
        setState({
          nettoyage: details?.nettoyage ?? "",
          details_technique: details?.details_technique ?? "",
        })
      })
  }, [data.id])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/admin/products/${data.id}/product-details`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      })
      if (!res.ok) throw new Error()
      toast.success("Sauvegardé", { description: "Les champs ont été mis à jour." })
    } catch {
      toast.error("Erreur", { description: "La sauvegarde a échoué." })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container>
      <Heading level="h2" className="mb-4">
        Informations techniques
      </Heading>
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-1">
          <Label>Nettoyage</Label>
          <RichTextEditor
            placeholder="Instructions de nettoyage..."
            value={state.nettoyage}
            onChange={(v) => setState((s) => ({ ...s, nettoyage: v }))}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label>Détails technique</Label>
          <RichTextEditor
            placeholder="Détails techniques du produit..."
            value={state.details_technique}
            onChange={(v) => setState((s) => ({ ...s, details_technique: v }))}
          />
        </div>
        <div className="flex justify-end">
          <Button size="small" isLoading={saving} onClick={handleSave}>
            Sauvegarder
          </Button>
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductDetailsWidget
