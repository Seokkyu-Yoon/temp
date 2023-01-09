import { JSONFile, Low } from 'lowdb'

import { config } from './config.js'
import { Project } from './project.js'
import { Workflow } from './workflow.js'
import { Algorithm } from './algorithm.js'
import { File } from './file.js'

import { logger } from '../../module/index.js'

export function LowDb () {
  let lowdb = null
  ;(async function createLowDb () {
    const createAfter = new Date().getTime() + 3000
    try {
      const adapter = new JSONFile(config.path)
      lowdb = new Low(adapter)
    } catch (err) {
      logger.error(err)
      lowdb = null
      setTimeout(() => {
        createLowDb()
      }, Math.max(createAfter - new Date().getTime(), 0))
    }
  })()
  return async () => {
    await lowdb.read()
    lowdb.data = lowdb.data || {}
    return {
      project: Project(lowdb),
      workflow: Workflow(lowdb),
      algorithm: Algorithm(lowdb),
      file: File(lowdb)
    }
  }
}
