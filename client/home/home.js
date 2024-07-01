function loadScript(url, callback) {
    var newScript = document.createElement('script');
    newScript.src = url;
    newScript.onload = () => {
        console.log(`Script loaded: ${newScript.src}`);
        if (callback) callback();
    };
    document.getElementById('script-record').appendChild(newScript);
}
function profile_init(){
    loadScript('/client/home/profile.js',()=>{
        fetch_profile();
    });
}