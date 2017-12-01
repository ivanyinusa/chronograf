import _ from 'lodash'
import {ALERTS_TO_RULE} from 'src/kapacitor/constants'

export const getHandlersFromRule = rule => {
  const handlersOfKind = {}
  const handlersOnThisAlert = []

  _.forEach(rule.alertNodes, (v, k) => {
    const count = _.get(handlersOfKind, k, 0) + 1
    handlersOfKind[k] = count
    const ep = {
      ...v,
      alias: k + count,
      type: k,
    }
    handlersOnThisAlert.push(ep)
  })
  const selectedHandler = handlersOnThisAlert.length
    ? handlersOnThisAlert[0]
    : null
  return {handlersOnThisAlert, selectedHandler, handlersOfKind}
}

export const getAlertNodeList = rule => {
  const nodeList = _.transform(
    rule.alertNodes,
    (acc, v, k) => {
      if (k in ALERTS_TO_RULE && v.length > 0) {
        acc.push(k)
      }
    },
    []
  )
  const uniqNodeList = _.uniq(nodeList)
  return _.join(uniqNodeList, ', ')
}