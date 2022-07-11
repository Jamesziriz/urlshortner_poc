self.addEventListener('install', (e)=>{
    console.log('service worker installed');
})


self.addEventListener('activate', (e)=>{
    console.log('service worker activated');
})

self.addEventListener('fetch', (e)=>{
})