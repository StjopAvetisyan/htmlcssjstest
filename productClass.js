export class Product {
    constructor(product, isPreOrder, dimensionsFromModel) {
        this.id = product._id; //info:: no difference in this case of id and guid in model
        this.name = product.name;
        this.isPreOrder = isPreOrder;
        this.maxCount = setMaxCount(product, isPreOrder);
        this.availableSizes = setSizes(product.specifications, dimensionsFromModel);
        this.availableColors = setColors(product.color);
        this.selectedSize = this.availableSizes[0];
        this.images = product.images
        this.selectedColor = this.availableColors[0];
    }
    changeSize(sizeId) {
        this.selectedSize = this.availableSizes.find(el => el.id === sizeId);
        this.maxCount = setMaxCount(this.selectedSize, this.isPreOrder);
        return this
    }
    changeColor(product, color) {
        //todo for now I think we dont need this
    }
}
const setColors = (colors) => {
    return Object.values(colors) || [];
};
const setSizes = (specifications, dimensionsFromModel) => {
    const availableSizes = [];
    for (const specification of specifications) {
        debugger
        if (specification.status) {
            const temp = {
                id: specification.guid,
                name: specification.name,
                dimensions: setDimensions(specification.dimensions, dimensionsFromModel),
                price: setPriceBySpecification(specification.price, specification.sale),
                balance: specification.balance,
            };
            availableSizes.push(temp);
        }
    }
    return availableSizes;
};
const setDimensions = (dimensions, dimensionsFromModel) => {
    let temp = {};
    for (const dimension in dimensions) {
        temp[dimension] = dimensions[dimension] || dimensionsFromModel[dimension];
    }
    return temp;
};
const setPriceBySpecification = (priceObj, sale) => {
    return {
        actualPrice: priceObj.count - priceObj.count * sale / 100,
        sale: !!sale,
        price: priceObj.count,
        currency: priceObj.currency
    };
};
const setMaxCount = (product, isPreorder) => {
    if (isPreorder) return -1;
    const balanceArr = product.balance.length ? product.balance : getBalancesFromSpecification(product.specifications);
    return (balanceArr.filter((balance) => balance.name === '2-Готовая продукция') || []).reduce((acc, cur) => acc + cur.count, 0);
};
const getBalancesFromSpecification = (specifications) => {
    return specifications?.flatMap((spec) =>
        spec.balance
    ) || [];
};
