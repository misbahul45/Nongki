import axios from "axios"
import { env } from "../config/env.js"
import { logger } from "./logger.js"

export const apiClient = axios.create({
  baseURL: env.API_INTERNAL_URL,
  timeout: 10_000,
  headers: {
    "x-internal-token": env.API_INTERNAL_TOKEN,
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    logger.error({ err: error.message, url: error.config?.url }, "API client error")
    return Promise.reject(error)
  },
)
