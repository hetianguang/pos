'use strict';

const printReceipt = tags=> {

    let goods_list = countTags(tags)
    let goods_base_info = getGoodsBaseInfo(goods_list)
    let goods_discount_info = getGoodsDiscountInfo(goods_base_info)
    let result = calculateCosts(goods_discount_info)
    console.log(result)

}


const countTags = tags => {
    let result = []
    for(let tag of tags) {
        let goods = parseBarcode(tag)
        let object = findObject(goods,result)
        object !== null ? object.count += goods.count : result.push(goods)
    }
    return result
}

const parseBarcode = tag => {
    let goodsBarcode = tag.split('-')
    return goodsBarcode.length > 1 
    ? 
    {
        barcode: goodsBarcode[0],
        count: parseFloat(goodsBarcode[1])
    }
    :
    {
        barcode:goodsBarcode[0],
        count: 1
    }
}

const findObject = (goods,result) => {
    for(let object of result) {
        if(object.barcode === goods.barcode) {
            return object
        }
    }
    return null
}


const getGoodsBaseInfo = goods_list => {
    let result = []
    let allItems = loadAllItems()
    for(let aGoods of goods_list) {
        for(let aItem of allItems) {
            if(aGoods.barcode === aItem.barcode) {
                result.push({
                  barcode: aItem.barcode,
                     name: aItem.name,
                     unit: aItem.unit,
                    price: aItem.price,
                    count: aGoods.count
                })
                break;
            }
        }
    }
    return result
}

const getGoodsDiscountInfo = goods_base_info => {
    let result = goods_base_info
    let allPromotions = loadPromotions()
    for(let aGoods of result) {
        for(let promotion of allPromotions) {
            if(promotion.barcodes.indexOf(aGoods.barcode) !== -1) {
                aGoods.discount = promotion.type
                break
            }
            aGoods.discount = null
        }
    }
    return result
}


const calculateCosts = goods_discount_info => {
    let result = '***<没钱赚商店>收据***'+'\n'
    let reduce = 0
    let total = 0
    for(let aGoods of goods_discount_info) {
        let aGoodsCost = 0
        if(aGoods.discount === null) {
            aGoodsCost = aGoods.count * aGoods.price
        } else if(aGoods.discount === 'BUY_TWO_GET_ONE_FREE') {
            if(aGoods.count >= 2) {
                reduce += aGoods.price
                aGoodsCost = (aGoods.count-1) * aGoods.price
            }
        }
        total += aGoodsCost
        let aPrint = '名称：' + aGoods.name+'，' 
               + '数量：'+ aGoods.count + aGoods.unit +'，'
               + '单价：' + parseFloat(aGoods.price).toFixed(2) + '(元)，'
               + '小计：' + parseFloat(aGoodsCost).toFixed(2) +'(元)'+'\n'
        result += aPrint
    }
    result = result 
           +'----------------------'+'\n' 
           + '总计：'+ parseFloat(total).toFixed(2) + '(元)'+'\n' 
           +'节省：' + parseFloat(reduce).toFixed(2) + '(元)' 
           +'\n'+'**********************'
    return result
}