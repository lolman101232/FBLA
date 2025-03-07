document.addEventListener("DOMContentLoaded", function () {
	const video = document.createElement("video");
	video.setAttribute("autoplay", "");
	video.setAttribute("playsinline", "");
	document.body.appendChild(video);

	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");
	const output = document.createElement("p");
	document.body.appendChild(output);
    
	// Access the webcam
	navigator.mediaDevices.getUserMedia({ video: true })
    	.then((stream) => {
        	video.srcObject = stream;
       	 
        	// Take a picture after 5 seconds
        	setTimeout(() => {
            	canvas.width = video.videoWidth;
            	canvas.height = video.videoHeight;
            	context.drawImage(video, 0, 0, canvas.width, canvas.height);
           	 
            	canvas.toBlob((blob) => {
                	if (!blob) {
                    	console.error("Error capturing image.");
                    	return;
                	}
    
                	const reader = new FileReader();
                	reader.readAsDataURL(blob);
                	reader.onloadend = () => {
                    	Tesseract.recognize(reader.result, 'eng', {
                        	logger: (m) => console.log(m)
                    	}).then(({ data: { text } }) => {
                        	console.log("Recognized Text:", text);
                        	output.textContent = "Recognized Text: " + text;
                    	});
                	};
            	});
        	}, 5000);
    	})
    	.catch((error) => {
        	console.error("Error accessing webcam:", error);
    	});
});



const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('captureButton');
const retryButton = document.getElementById('retryButton');
const outputDiv = document.getElementById('output');
const context = canvas.getContext('2d');
let stream = null;

async function startWebcam() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        outputDiv.textContent = 'Error accessing webcam: ' + err;
        console.error('Error accessing webcam:', err);
    }
}

function captureImage() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.style.display = 'block';
    video.style.display = 'none';
}

async function extractText() {
    outputDiv.textContent = 'Extracting text...';
    try {
        const { data: { text } } = await Tesseract.recognize(
          canvas,
          'eng', // Change to appropriate language code if needed
        );
        //outputDiv.textContent = 'Extracted Text: ' + text; //old code
        
        //new code
        const totalIndex = text.toUpperCase().indexOf('TOTAL'); //find the index of the word Total
        if (totalIndex !== -1) { // if total is found
            const remainingText = text.substring(totalIndex + 'TOTAL'.length); // get the remaining text after total
            const numberMatch = remainingText.match(/[\d\.,]+/); //find the first number in the text, this supports , and . to be in the number
            if (numberMatch) { // if a number is found
                outputDiv.textContent = 'Total found: ' + numberMatch[0];
            } else {
                outputDiv.textContent = 'No number found after "Total".';
            }
        } else {
            outputDiv.textContent = '"Total" not found in text.';
        }
    } catch (err) {
        outputDiv.textContent = 'Error extracting text: ' + err;
        console.error('Error extracting text:', err);
    }
}

function startCaptureProcess() {
    captureButton.disabled = true;
    outputDiv.textContent = 'Capturing in 5 seconds...';

    setTimeout(() => {
        captureImage();
        outputDiv.textContent = 'Picture taken!';
        
        //Stop the webcam
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
          }
        //display retry button
        retryButton.style.display = 'block';
        
        extractText();
    }, 5000);
}

captureButton.addEventListener('click', () => {
    startWebcam();
    startCaptureProcess();
    captureButton.disabled = true;
    captureButton.style.display = 'none';
});

retryButton.addEventListener('click', ()=>{
    //restart webcam
    startWebcam();
    video.style.display = 'block';
    canvas.style.display = 'none';
    
    //restart capture process
    startCaptureProcess();
    
    //hide retry button
    retryButton.style.display = 'none';
});
