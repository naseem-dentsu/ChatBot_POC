import { configDotenv } from "dotenv";
export default function configuration() {

  configDotenv()
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}