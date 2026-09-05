import {configDotenv} from 'dotenv'
configDotenv({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
  quiet: true
})

import 'reflect-metadata'
import '../src/dependencies/dependency.container'
