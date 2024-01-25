import { ChangeEvent, useEffect, useState } from "react";

import styles from './teachable.module.css';

export const Teachable = () => {
    const modelLocation = './model/';
    let model: any, webcam: any, labelContainer: any, maxPredictions: any;
    const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
        if (image != null) {
            init().then(() => predict())
        }
    }, [image])

    const init = async () => {
        const modelURL = modelLocation + 'model.json';
        const metadataURL = modelLocation + 'metadata.json';
        const ww: any = window

        // load the model and metadata
        model = await ww.tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        labelContainer = document.getElementById('label-container');
        for (let i = 0; i < maxPredictions; i++) {
            // and class labels
            labelContainer.appendChild(document.createElement('div'));
        }
    }

    const predict = async () => {
        // Create an HTMLImageElement from the uploaded file
        const imageElement = document.createElement('img');
        imageElement.style.height = '300px'
        imageElement.style.width = '300px'
        const imagePreview = document.getElementById('imagePreview')
        if (imagePreview && imagePreview.childElementCount > 0) {
            imagePreview?.removeChild(imagePreview.firstChild!)
        }
        imageElement.src = URL.createObjectURL(image!);
        imageElement.onload = async () => {
            // predict can take in an image, video or canvas html element
            const prediction = await model.predict(imageElement, false);
            for (let i = 0; i < maxPredictions; i++) {
                const classPrediction =
                    prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
                labelContainer.childNodes[i].innerHTML = classPrediction;
            }
        };
        imagePreview?.appendChild(imageElement)
    }

    const onFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file: File | null = event.target.files && event.target.files[0];
        console.log(file)
        setImage(file)
    }

    return (
        <>
            <div>Teachable Machine Image Model</div>
            <div id="webcam-container"></div>
            <div id="label-container"></div>
            <div id="imagePreview" className={styles.imagePreview} />
            <input id="imageUpload" type="file" onChange={onFileUpload} />
        </>
    )
}