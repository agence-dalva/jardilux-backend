import { model } from "@medusajs/framework/utils"

const ProductDetails = model.define("product_details", {
  id: model.id().primaryKey(),
  nettoyage: model.text().nullable(),
  details_technique: model.text().nullable(),
})

export default ProductDetails
