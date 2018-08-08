export class ScrollHelper {
    private classToScrollTo: string = null;

    scrollToFirst(className: string) {
        this.classToScrollTo = className;
    }

    doScroll() {
        if (!this.classToScrollTo) {
            return;
        }
        try {
            var elements = document.getElementsByClassName(this.classToScrollTo);
            if (elements.length == 0) {
                return;
            }
            elements[0].scrollIntoView();
        }
        finally{
            this.classToScrollTo = null;
        }
    }

   scrollTo(target){
    var scrollContainer = target;
    do { //find scroll container
        scrollContainer = scrollContainer.parentNode;
        if (!scrollContainer) return;
        scrollContainer.scrollTop += 1;
    } while (scrollContainer.scrollTop == 0);

    var targetY = 0;
    do { //find the top of target relatively to the container
        if (target == scrollContainer) break;
        targetY += target.offsetTop;
    } while (target = target.offsetParent);

   
    // start scrolling
    this.scroll(scrollContainer, scrollContainer.scrollTop, targetY, 0);

   }

   scroll(c, a, b, i) {
        i++; if (i > 30) return;
        c.scrollTop = a + (b - a) / 30 * i;
        var that = this;
        setTimeout(function(){ that.scroll(c, a, b, i); }, 20);
    }
}