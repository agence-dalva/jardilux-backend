import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { PRODUCT_DETAILS_MODULE } from "../../../../../modules/product-details"

type RequestBody = {
  nettoyage?: string
  details_technique?: string
}

export const POST = async (
  req: MedusaRequest<RequestBody>,
  res: MedusaResponse
) => {
  const { id } = req.params
  const { nettoyage, details_technique } = req.body

  const productDetailsService = req.scope.resolve(PRODUCT_DETAILS_MODULE)
  const remoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph({
    entity: "product",
    filters: { id },
    fields: ["product_details.id"],
  })

  const existingList: { id: string }[] = (data[0] as any)?.product_details ?? []
  const existing = Array.isArray(existingList) ? existingList[0] : existingList

  if (existing?.id) {
    await productDetailsService.updateProductDetails([
      { id: existing.id, nettoyage, details_technique },
    ])
  } else {
    const [created] = await productDetailsService.createProductDetails([
      { nettoyage, details_technique },
    ])
    await remoteLink.create([
      {
        [Modules.PRODUCT]: { product_id: id },
        [PRODUCT_DETAILS_MODULE]: { product_details_id: created.id },
      },
    ])
  }

  res.json({ success: true })
}
