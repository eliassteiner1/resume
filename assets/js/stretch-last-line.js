// Stretch the last line of justified text if it already fills most of the line anyway.
// Otherwise a nearly-full last line sits slightly ragged next to the justified lines above it.

const STRETCH_THRESHOLD = 0.90; // last line width / available width above which it gets stretched

// the nearest non-inline ancestors of all text, if justified (text-align-last has no effect on inline elements like <i>)
function getJustifiedTextEls() {
    const els = new Set();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
        if (!walker.currentNode.textContent.trim()) continue;
        let el = walker.currentNode.parentElement;
        while (getComputedStyle(el).display === "inline") el = el.parentElement;
        if (getComputedStyle(el).textAlign === "justify") els.add(el);
    }
    return [...els];
}

// width of the last rendered line relative to the element's content box
function lastLineRatio(el) {
    const range = document.createRange();
    range.selectNodeContents(el);
    const rects = [...range.getClientRects()].filter(r => r.width > 0);
    if (!rects.length) return 0;

    // the last line consists of all fragments vertically overlapping the very last one
    const last = rects[rects.length - 1];
    const lineRects = rects.filter(r => r.bottom > last.top + last.height / 2);
    const lineWidth = Math.max(...lineRects.map(r => r.right)) - Math.min(...lineRects.map(r => r.left));

    const style = getComputedStyle(el);
    const contentWidth = el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    return lineWidth / contentWidth;
}

function stretchLastLines() {
    const els = getJustifiedTextEls();
    els.forEach(el => el.style.textAlignLast = ""); // reset first, otherwise stretched lines measure as full
    els.forEach(el => {
        if (lastLineRatio(el) > STRETCH_THRESHOLD) el.style.textAlignLast = "justify";
    });
}

// widths depend on the loaded fonts and differ between screen and print layout
document.fonts.ready.then(stretchLastLines);
window.addEventListener("resize", stretchLastLines);
window.addEventListener("beforeprint", stretchLastLines);
window.addEventListener("afterprint", stretchLastLines);
