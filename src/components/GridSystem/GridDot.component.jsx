import React from 'react'
import ReactDOM from 'react-dom'
import { DropTarget } from 'react-dnd'
import { connect } from 'react-redux'

import { getWidthHeightPositionOfWidget } from '../../utils/grid'
import { ITEM_TYPES } from '../../constants/dnd-types'
import { UPDATE_TYPES } from '../../store/actions/userSettingsActions'
import { updateUserSettings } from '../../store/actions/userSettingsActions'

class GridDot extends React.Component {
    render() {
        const { connectDropTarget, hovered, canDrop } = this.props

        return connectDropTarget(<span className="grid-dot" />)
    }
}

const dropTargetContract = {
    drop: (props, monitor, component) => {
        const gridDotHTMLElement = ReactDOM.findDOMNode(component)
        const widgetPosition = getWidthHeightPositionOfWidget(gridDotHTMLElement)
        const widgetTitle = monitor.getItem().title.toLowerCase()

        props.updateUserSettings(
            UPDATE_TYPES.SETTINGS_WIDGET_POSITIONS,
            {
                widgetTitle,
                coordinates: {
                    x: widgetPosition.widgetPosition.x,
                    y: widgetPosition.widgetPosition.y
                },
                measurements: {
                    width: widgetPosition.widgetWidth,
                    height: widgetPosition.widgetHeight
                }
            }
        )
    }
}

const collector = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    hovered: monitor.isOver(),
    canDrop: monitor.canDrop()
})

const mapDispatchToProps = dispatch => {
    return {
        updateUserSettings: (updateType, payload) => dispatch(updateUserSettings(updateType, payload))
    }
}

export default connect(
    null,
    mapDispatchToProps
)(DropTarget(
    ITEM_TYPES.WIDGET,
    dropTargetContract,
    collector
)(GridDot))