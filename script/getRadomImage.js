export default function getRandomImage() {
    const image = new Image();
    image.crossOrigin = true;
    image.addEventListener('error', (error) => reject(error));
    image.src = `https://source.unsplash.com/random?face&t=${Date.now()}`;
    return image
}
