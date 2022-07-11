if('serviceWorker' in navigator){
    navigator.serviceWorker.register('serviceworker.js').then((reg)=> console.log('service worker registered',reg)).catch((error)=> console.log('service worker not registered',err));
}


async function copyText(cpid) {
    /* Copy text into clipboard */
        var cp = document.getElementById(cpid);
        navigator.clipboard.writeText(cp.text).then(()=>{alert("Copied the text: " + cp.text)});
    }

function showQR(){
    var qrshow = document.getElementById('qrdiv');
    qrshow.style.display="flex";
}

async function copyImage() {
    var url = document.getElementById("qrcode");
    const fetchedImageData = await fetch(url.src);
    const blob = await fetchedImageData.blob();
    navigator.clipboard.write([new ClipboardItem({[blob.type]: blob})]).then(() =>{alert('Image copied to clipboard!')});
}