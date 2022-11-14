export enum AutoRefreshOptionType {
    Option = 'option',
    Header = 'header',
}

export interface AutoRefreshOption {
    id: string
    milliseconds: number
    label: string
    type: AutoRefreshOptionType
}

export const autoRefreshOptionPaused: AutoRefreshOption = {
    id: 'auto-refresh-paused',
    milliseconds: 0,
    label: 'Paused',
    type: AutoRefreshOptionType.Option,
}

const defaultAutoRefreshOptions: AutoRefreshOption[] = [
    {
        id: 'auto-refresh-header',
        milliseconds: 9999,
        label: 'Refresh',
        type: AutoRefreshOptionType.Header,
    },
    autoRefreshOptionPaused,
    {
        id: 'auto-refresh-10ms',
        milliseconds: 10,
        label: '10ms',
        type: AutoRefreshOptionType.Option,
    },
    {
        id: 'auto-refresh-50ms',
        milliseconds: 50,
        label: '50ms',
        type: AutoRefreshOptionType.Option,
    },
    {
        id: 'auto-refresh-100ms',
        milliseconds: 100,
        label: '100ms',
        type: AutoRefreshOptionType.Option,
    },
    {
        id: 'auto-refresh-1s',
        milliseconds: 1000,
        label: '1s',
        type: AutoRefreshOptionType.Option,
    },
    {
        id: 'auto-refresh-5s',
        milliseconds: 5000,
        label: '5s',
        type: AutoRefreshOptionType.Option,
    },
]
let autoRefreshOptions = [...defaultAutoRefreshOptions]

/** setCustomAutoRefreshOptions allows to set custom auto-refresh options */
export function setCustomAutoRefreshOptions(customSpec: string | undefined) {
    if (customSpec === undefined) {
        return
    }
    const [header, paused, ...otherDefault] = defaultAutoRefreshOptions
    const customOptions: AutoRefreshOption[] = customSpec
        .split(';')
        .reduce((acc, singleSpec) => {
            if (!singleSpec) {
                return acc // ignore empty values
            }
            try {
                const [a, b] = singleSpec.split('=')
                const label = a.trim()
                const milliseconds = parseInt(b, 10)
                // if (!(milliseconds >= 100)) {
                //     throw new Error('Miliseconds is not a positive number >= 100')
                // }
                acc.push({
                    id: `custom-refresh-${label}`,
                    milliseconds,
                    label,
                    type: AutoRefreshOptionType.Option,
                })
            } catch (e) {
                console.warn(
                    `Ignoring custom autoRefreshOption "${singleSpec}", it must have format label=milliseconds !, e
            }`
                )
            }
            return acc
        }, [] as AutoRefreshOption[])
    autoRefreshOptions = [
        header,
        paused,
        ...[...otherDefault, ...customOptions].sort(
            (a, b) => a.milliseconds - b.milliseconds
        ),
    ]
}

export function getAutoRefreshOptions(): AutoRefreshOption[] {
    return autoRefreshOptions
}
