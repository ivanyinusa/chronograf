import React, {Component, PropTypes} from 'react'

import AnnotationTooltip from 'src/shared/components/AnnotationTooltip'

import {
  annotationStyle,
  flagStyle,
  clickAreaStyle,
} from 'src/shared/annotations/styles'

class Annotation extends Component {
  state = {
    isDragging: false,
    isMouseOver: false,
  }

  handleStartDrag = () => {
    this.setState({isDragging: true})
  }

  handleStopDrag = () => {
    this.setState({isDragging: false})
  }

  handleMouseEnter = () => {
    this.setState({isMouseOver: true})
  }

  handleMouseLeave = e => {
    const {annotation} = this.props

    if (e.relatedTarget.id === `tooltip-${annotation.id}`) {
      return this.setState({isDragging: false})
    }
    this.setState({isDragging: false, isMouseOver: false})
  }

  handleDrag = e => {
    if (!this.state.isDragging) {
      return
    }

    const {pageX} = e
    const {annotation, annotations, dygraph, onUpdateAnnotation} = this.props
    const {id, time, duration} = annotation
    const {left} = dygraph.graphDiv.getBoundingClientRect()
    const [startX, endX] = dygraph.xAxisRange()

    const graphX = pageX - left
    let newTime = dygraph.toDataXCoord(graphX)
    const oldTime = +time

    const minPercentChange = 0.5

    if (
      Math.abs(
        dygraph.toPercentXCoord(newTime) - dygraph.toPercentXCoord(oldTime)
      ) *
        100 <
      minPercentChange
    ) {
      return
    }

    if (newTime >= endX) {
      newTime = endX
    }

    if (newTime <= startX) {
      newTime = startX
    }

    const idAppendage = '-end'
    const isEndpoint =
      id.substring(id.length - idAppendage.length) === idAppendage

    if (isEndpoint) {
      const startID = id.substring(0, id.length - idAppendage.length)
      const startAnnotation = annotations.find(a => a.id === startID)
      if (!startAnnotation) {
        return console.error('Start annotation does not exist')
      }

      const newDuration = newTime - oldTime + Number(startAnnotation.duration)

      this.counter = this.counter + 1
      return onUpdateAnnotation({
        ...startAnnotation,
        duration: `${newDuration}`,
      })
    }

    if (duration) {
      const differenceInTimes = oldTime - newTime
      const newDuration = Number(duration) + differenceInTimes

      return onUpdateAnnotation({
        ...annotation,
        time: `${newTime}`,
        duration: `${newDuration}`,
      })
    }

    onUpdateAnnotation({...annotation, time: `${newTime}`})

    e.preventDefault()
    e.stopPropagation()
  }

  render() {
    const {annotation, dygraph} = this.props
    const {isDragging, isMouseOver} = this.state

    const humanTime = `${new Date(+annotation.time)}`

    return (
      <div
        className="dygraph-annotation"
        style={annotationStyle(annotation, dygraph, isDragging)}
        data-time-ms={annotation.time}
        data-time-local={humanTime}
      >
        <div
          style={clickAreaStyle(isDragging)}
          onMouseMove={this.handleDrag}
          onMouseDown={this.handleStartDrag}
          onMouseUp={this.handleStopDrag}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        />
        <div style={flagStyle(isMouseOver, isDragging)} />
        <AnnotationTooltip
          annotation={annotation}
          onMouseLeave={this.handleMouseLeave}
          annotationState={this.state}
        />
      </div>
    )
  }
}

const {arrayOf, func, shape, string} = PropTypes

Annotation.propTypes = {
  annotations: arrayOf(shape({})),
  annotation: shape({
    id: string.isRequired,
    time: string.isRequired,
    duration: string,
  }).isRequired,
  dygraph: shape({}).isRequired,
  onUpdateAnnotation: func.isRequired,
}

export default Annotation