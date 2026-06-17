import { Module } from "@medusajs/framework/utils"
import ProductDetailsModuleService from "./service"

export const PRODUCT_DETAILS_MODULE = "productDetails"

export default Module(PRODUCT_DETAILS_MODULE, {
  service: ProductDetailsModuleService,
})
