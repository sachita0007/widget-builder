
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = await params;
    const origin = req.nextUrl.origin;

    const script = `
(function() {
    console.log("[Freestand] Initializing widget ${id}...");
    
    // Prevent multiple initializations
    if (window.__FREESTAND_WIDGET_${id}__) {
        console.log("[Freestand] Widget ${id} already initialized, skipping.");
        return;
    }
    window.__FREESTAND_WIDGET_${id}__ = true;

    const findScript = () => {
        const found = document.querySelector('script[data-widget-id="${id}"]') || document.currentScript;
        if (!found) console.warn("[Freestand] Could not find script tag for widget ${id}. Make sure data-widget-id is set.");
        return found;
    };

    const scriptTag = findScript();
    if (!scriptTag) return;

    const containerId = scriptTag.getAttribute('data-container-id');
    let container;

    if (containerId) {
        container = document.getElementById(containerId);
        if (!container) console.warn("[Freestand] Container ID " + containerId + " not found in DOM.");
    }

    if (!container) {
        container = document.createElement('div');
        container.style.width = '100%';
        scriptTag.parentNode.insertBefore(container, scriptTag.nextSibling);
        console.log("[Freestand] Created default container for widget ${id}.");
    }

    const iframe = document.createElement('iframe');
    const baseUrl = "${origin}";
    iframe.src = baseUrl + "/widget/" + "${id}";
    iframe.style.width = '100%';
    iframe.style.height = '800px';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.style.backgroundColor = 'white'; // Ensure it's not invisible on dark backgrounds
    iframe.style.transition = 'height 0.3s ease';
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('frameborder', '0');

    container.appendChild(iframe);
    console.log("[Freestand] Iframe injected for widget ${id}. Status: Pending loading...");

    // Resize listener
    window.addEventListener('message', function(e) {
        if (e.data && e.data.type === 'freestand-resize' && e.data.widgetId === "${id}") {
            iframe.style.height = e.data.height + 'px';
            console.log("[Freestand] Widget ${id} resized to " + e.data.height + "px.");
        }
    }, false);
})();
    `.trim();

    return new NextResponse(script, {
        headers: {
            "Content-Type": "application/javascript",
            "Cache-Control": "public, max-age=3600",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
        },
    });
}
