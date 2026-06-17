import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph({
    entity: "product",
    filters: { id },
    fields: ["product_details.nettoyage", "product_details.details_technique"],
  })

  const raw = (data[0] as any)?.product_details
  const details = Array.isArray(raw) ? raw[0] : raw

  res.json({
    nettoyage: details?.nettoyage ?? null,
    details_technique: details?.details_technique ?? null,
  })
}
