export default function():  Promise<File[] | null> {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.style.display = 'none';
        input.addEventListener('change', () => {
            const files = input.files ? Array.from(input.files) : null;
            resolve(files);
        });

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    });
}

