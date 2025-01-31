export default function(name: string, data: string) {
    const blob = new Blob([data], {type: "text/plain"})
    const file = new File([blob], name, {
        type: 'text/plain',
        lastModified: Date.now()
    })

    return file
}