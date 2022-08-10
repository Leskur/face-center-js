import getRandomImage from "./getRadomImage.js";

(() => {
    const buttonRefresh = document.getElementById('button-refresh'),
        containerInput = document.getElementById("container-input"),
        containweOutput = document.getElementById("container-output");
    buttonRefresh.addEventListener('click', () => {
        const image = getRandomImage()
        containerInput.innerHTML = ""
        containweOutput.innerHTML = ""
        containerInput.append(image)

        image.onload = async function () {
            containweOutput.innerHTML = image.outerHTML;
            const newImage = containweOutput.children[0]
            newImage.setAttribute('face-center', "")
            containweOutput.append(newImage)
        }

    });
})()