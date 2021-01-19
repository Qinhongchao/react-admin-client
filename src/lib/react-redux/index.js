import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class Provider extends Component {

    static propTypes = {
        store: PropTypes.object.isRequired  // 声明接收store
    }

    // 声明提供的context的数据名称和类型
    static childContextTypes = {
        store: PropTypes.object
    }

    /*
    向所有有声明子组件提供包含要传递数据的context对象
     */
    getChildContext() {
        return {
            store: this.props.store
        }
    }

    render() {
        return this.props.children
    }
}

export function connect(mapStateToProps, mapDispatchToProps) {


    return (UIComponent) => {

        return class ConnectComponent extends Component {

            // 声明接收的context数据的名称和类型
            static contextTypes = {
                store: PropTypes.object
            }

            constructor(props, context) {
                super(props)
                const store = context.store
                const stateProps = mapStateToProps(store.getState())
                let dispatchProps
                if (typeof mapDispatchToProps === 'function') {
                    dispatchProps = mapDispatchToProps(store.dispatch)
                } else {
                    dispatchProps = Object.keys(mapDispatchToProps).reduce((pre, key) => {
                        const actionCreator = mapDispatchToProps[key]
                        pre[key] = function (...args) {
                            store.dispatch(actionCreator(...args))
                        }
                        return pre
                    }, {})

                }

                this.state = {
                    ...stateProps
                }
                this.dispatchProps = dispatchProps

                store.subscribe(() => {
                    this.setState(mapStateToProps(store.getState()))
                })
            }

            render() {
                return <UIComponent  {...this.state} {...this.dispatchProps} />
            }
        }
    }
}