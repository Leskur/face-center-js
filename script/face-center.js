import './face-api.min'

async function cropImage(image) {
    image.setAttribute('crossorigin', 'anonymous')
    const faces = await faceapi.detectAllFaces(
        image,
        new faceapi.TinyFaceDetectorOptions(),
    );

    if (faces.length === 0) {
        image.setAttribute('face-center-cropped', '')
        return
    }

    const box = {
        bottom: 0,
        left: image.naturalWidth,
        right: 0,
        top: image.naturalHeight,
        get height() {
            return this.bottom - this.top;
        },
        get width() {
            return this.right - this.left;
        },
    };
    for (const face of faces) {
        box.bottom = Math.max(box.bottom, face.box.bottom);
        box.left = Math.min(box.left, face.box.left);
        box.right = Math.max(box.right, face.box.right);
        box.top = Math.min(box.top, face.box.top);
    }

    const minMarginY = Math.min(box.top, image.naturalHeight - box.bottom)
    const minMarginX = Math.min(box.left, image.naturalWidth - box.right)
    box.bottom = box.bottom + minMarginY
    box.left = box.left - minMarginX
    box.right = box.right + minMarginX;
    box.top = box.top - minMarginY;

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    context.canvas.height = box.height;
    context.canvas.width = box.width;
    context.canvas.hidden = false;

    context.drawImage(
        image,
        box.left,
        box.top,
        box.width,
        box.height,
        0,
        0,
        box.width,
        box.height,
    );

    canvas.toBlob(function (blob) {
        canvas.remove();
        const url = URL.createObjectURL(blob)
        image.setAttribute('face-center-cropped', '')
        image.src = url
        image.onload = function () {
            URL.revokeObjectURL(url);
        };
    });
}


(async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri('https://unpkg.com/face-center-js@latest/models/');
    document.addEventListener('load', function (event) {
        const element = event.target
        if (element.tagName === 'IMG' && element.hasAttribute("face-center")) {
            const centered = element.hasAttribute('face-center-cropped')
            if (!centered) {
                cropImage(element)
            } else {
                element.setAttribute('crossorigin', 'anonymous')
            }
        }
    }, true)

})();
