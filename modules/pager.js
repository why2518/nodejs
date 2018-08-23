function getPages(page, totalPage) {
    var pages = [page]; //[6]
    var left = page - 1; //5,4,3,2,1
    var right = page + 1;//7,8,9,10,11

    while (pages.length < 10 && (left >= 1 || right <= totalPage)) {
        if (left >= 1) {
            pages.unshift(left--);//[2,3,4,5,6]
        }

        if (pages.length < 10 && right <= totalPage) {
            pages.push(right++); // [2,3,4,5,6,7,8,9,10,11]
        }
    }
    return pages;
}

module.exports = getPages;