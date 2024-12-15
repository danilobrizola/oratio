import { config } from 'dotenv'
import { resolve } from 'path'

// Carrega as variáveis de ambiente do arquivo .env.local
config({ path: resolve(process.cwd(), '.env.local') })
