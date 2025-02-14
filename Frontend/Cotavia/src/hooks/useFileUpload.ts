export default function(
    fileType: 'image' | 'text' | 'any' = 'any', muliple: boolean = false
):  Promise<File[] | null> {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.style.display = 'none';
        input.multiple = muliple
        // Set the accept attribute based on the file type you want
        if (fileType === 'image') {
            input.accept = 'image/*';
        } else if (fileType === 'text') {
            input.accept = 'text/*';
        } else {
            // For any file type, you can leave it empty or explicitly set '*/*'
            input.accept = '*/*';
        }

        input.addEventListener('change', () => {
            const files = input.files ? Array.from(input.files) : null;
            resolve(files);
        });

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    });
}

