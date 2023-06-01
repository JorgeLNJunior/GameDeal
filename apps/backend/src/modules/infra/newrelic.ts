import dotenv from 'dotenv'
dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' })

// eslint-disable-next-line import/first
import 'newrelic'
