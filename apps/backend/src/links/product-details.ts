import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/product"
import ProductDetailsModule from "../modules/product-details"

export default defineLink(
  ProductModule.linkable.product,
  ProductDetailsModule.linkable.productDetails
)
