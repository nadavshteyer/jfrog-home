let data1;
fetch(`https://jsonplaceholder.typicode.com/photos`,{
    method: "GET",
    headers: {
        'Content-Type': 'application/json'
    }}).then(res => res.json())
.then( data => {
    console.log(data)
    data1 = data;
    const list = new VirtualList1({
        width: 300,
        height: 300,
        itemHeight: 50,
        // items: data,
        totalRows: 5000,
        createElement: (row) => {
            const element = document.createElement("div");
            const img = document.createElement('img');
            const span = document.createElement('span')
            img.src = row.thumbnailUrl;
            img.style.width = "50px";
            img.style.height = "50px";
            span.innerHTML =  row.title;
            element.style.textAlign = "center";
            element.style.width = "300px";
            element.style.height = "50px";
            element.style.display = "flex";
            element.style.flexDirection = "row"
            element.appendChild(img)
            element.append(span)
            return element;
        }
    });
    
    list.container.style.marginLeft = "auto";
    list.container.style.marginRight = "auto";
    console.log(list)
    document.getElementById("placeholder").appendChild(list.container);
})
.catch((err) => {
    console.log('Looks like there was a problem: \n', err);
});




class VirtualList1 {
    constructor({width,height,itemHeight, createElement, totalRows}) {
        this.width = width + "px";
        this.height = height + "px";
        this.heightNoPx = height
        this.itemHeight = itemHeight;
        this.createElement = createElement;
        this.totalRows = totalRows;
        this.scroller = this.createScrollBar(this.itemHeight * this.totalRows);
        this.container = this.createDataContainer(this.width, this.height);
        this.firstRender();
    }

    firstRender () {
        const onScreenItems = Math.ceil(this.heightNoPx / this.itemHeight);
        const totalItemsCached = onScreenItems * 3;
        
        this.render(this.container, 0, totalItemsCached / 2);

        const onScroll =(e) => {
            e.preventDefault();
    
            let lastRepaintY;
            const maxBuffer = onScreenItems * this.itemHeight;
    
        
            const scrollTop = e.target.scrollTop;
            let firstItemToRender = parseInt(scrollTop / this.itemHeight) - onScreenItems;
            firstItemToRender = firstItemToRender < 0 ? 0 : firstItemToRender;
            if (!lastRepaintY || Math.abs(scrollTop - lastRepaintY) > maxBuffer) {
                this.render(this.container, firstItemToRender, totalItemsCached);
                lastRepaintY = scrollTop;
            }
        }
        this.container.addEventListener("scroll", onScroll);

    }

    render(container, startRenderFrom,howMany) {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(this.scroller);

        let finalItem = startRenderFrom + howMany;
        if (finalItem > this.totalRows) finalItem = this.totalRows;

        for (let i = startRenderFrom; i < finalItem; i++) {
            const item = this.createElement(data1[i]);
            item.style.position = "absolute";
            item.style.top = i * this.itemHeight + "px";
            fragment.appendChild(item);
          }
          container.innerHTML = "";
          container.appendChild(fragment);

    }

    createDataContainer(width, height) {
        const div = document.createElement("div");
        div.style.width = width;
        div.style.height = height;
        div.style.overflow = "auto";
        div.style.position = "relative";
        div.style.padding = 0;
        div.style.border = "1px solid black";
        return div
    }

    createScrollBar(height) {
        const scroller = document.createElement("div");
        scroller.style.opacity = 0;
        scroller.style.position = "absolute";
        scroller.style.top = 0;
        scroller.style.left = 0;
        scroller.style.width = "1px";
        scroller.style.height = height + "px";
        return scroller;
    }
}


