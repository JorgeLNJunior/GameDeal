import { resolve } from 'node:path'
process.loadEnvFile(resolve(process.cwd(), process.env.NODE_ENV === 'test' ? '.env.test' : '.env'))

import 'newrelic'
import '@newrelic/mysql'
