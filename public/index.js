let url = "https://google.com/";

const keydown = (e) => {
    console.log(e.altKey);
    console.log(e.code);
    console.log(e.shiftKey);
    if(e.code === "Backquote" && e.shiftKey) {
        url = prompt("url");
        run();
    } else if(e.code === "KeyR" && e.altKey) {
        run();
    }
}

async function run() {
    const error = document.getElementById("uv-error");
    const errorCode = document.getElementById("uv-error-code");
    const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
    error.style.display = "none";
    errorCode.style.display = "none";
    try {
        await registerSW();
    } catch(e) {
        error.style.display = "block";
        errorCode.style.display = "block";
        error.textContent = "Failed to register service worker.";
        errorCode.textContent = e.toString();
    }
    let frame = document.getElementById("uv-frame");
    frame.style.display = "block";
    let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
	if (await connection.getTransport() !== "/epoxy/index.mjs") {
		await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
	}
	frame.src = __uv$config.prefix + __uv$config.encodeUrl(url);
}

setTimeout(async () => {
    run();

    window.addEventListener("keydown", keydown);
}, "1000");

document.getElementById("uv-frame").addEventListener("load", (e) => {
    console.log("hi");
    document.getElementById("uv-frame").contentWindow.addEventListener("keydown", keydown);
});