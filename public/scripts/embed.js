(function () {
    const siteId = document.currentScript.getAttribute("data-site-id");
    if (!siteId) return;
  
    const iframe = document.createElement("iframe");
    iframe.src = `http://localhost:3000/embed/chat?siteId=${siteId}`;
    iframe.style.position = "fixed";
    iframe.style.bottom = "24px";
    iframe.style.right = "24px";
    iframe.style.width = "360px";
    iframe.style.height = "520px";
    iframe.style.border = "none";
    iframe.style.zIndex = "9999";
    // iframe.style.borderRadius = "12px";
    // iframe.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
    iframe.setAttribute("title", "Chat Widget");
  
    document.body.appendChild(iframe);
  })();