
class LoadingManager {
    constructor() {
        this.loadingElsByRef = {}
        this.loadingEls = []
    }

    addLoadingEl(el, value, targetRefs, remove) {
        if (targetRefs) {
            targetRefs.forEach(targetRef => {
                if (this.loadingElsByRef[targetRef]) {
                    this.loadingElsByRef[targetRef].push({el, value, remove})
                } else {
                    this.loadingElsByRef[targetRef] = [{el, value, remove}]
                }
            })
        } else {
            this.loadingEls.push({el, value, remove})
        }
    }

    removeLoadingEl(node) {
        const el = new DOMElement(node)

        this.loadingEls = this.loadingEls.filter(({el}) => ! el.isSameNode(node))

        if (el.ref in this.loadingElsByRef) {
            delete this.loadingElsByRef[el.ref]
        }
    }

    setLoading(refs) {
        const refEls = refs.map(ref => this.loadingElsByRef[ref]).filter(el => el).flat()

        const allEls = this.loadingEls.concat(refEls)

        allEls.forEach(el => {
            const directive = el.el.directives.get('loading')
            el = el.el.el // I'm so sorry @todo

            if (directive.modifiers.includes('class')) {
                // This is because wire:loading.class="border border-red"
                // wouldn't work with classList.add.
                const classes = directive.value.split(' ')

                if (directive.modifiers.includes('remove')) {
                    el.classList.remove(...classes)
                } else {
                    el.classList.add(...classes)
                }
            } else if (directive.modifiers.includes('attr')) {
                if (directive.modifiers.includes('remove')) {
                    el.removeAttribute(directive.value)
                } else {
                    el.setAttribute(directive.value, true)
                }
            } else {
                el.style.display = 'inline-block'
            }
        })

        return allEls
    }

    unsetLoading(loadingEls) {
        loadingEls.forEach(el => {
            const directive = el.el.directives.get('loading')
            el = el.el.el // I'm so sorry @todo

            if (directive.modifiers.includes('class')) {
                const classes = directive.value.split(' ')

                if (directive.modifiers.includes('remove')) {
                    el.classList.add(...classes)
                } else {
                    el.classList.remove(...classes)
                }
            } else if (directive.modifiers.includes('attr')) {
                if (directive.modifiers.includes('remove')) {
                    el.setAttribute(directive.value)
                } else {
                    el.removeAttribute(directive.value, true)
                }
            } else {
                el.style.display = 'none'
            }
        })

        return loadingEls
    }
}

export default LoadingManager