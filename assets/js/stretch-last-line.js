// Stretch the last line of justified text if it already fills most of the line anyway.
// Otherwise a nearly-full last line sits slightly ragged next to the justified lines above it.

const STRETCH_THRESHOLD = 0.9; // last line width / available width above which it gets stretched

// all elements that are justified and directly contain text (skips pure wrappers like .timeline-desc)
function getJustifiedTextEls() {
    return [...document.body.querySelectorAll("*")].filter(el =>
        getComputedStyle(el).textAlign === "justify" &&
        [...el.childNodes].some(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim())
    );
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
