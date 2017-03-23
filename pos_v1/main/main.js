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
        let st = []
        if(tag.indexOf('-') != -1) {
            st = tag.split('-')
             let object = findObject(st[0],result)
             if(object != null) {
                 object.count = parseFloat(object.count) + parseFloat(st[1])
                 continue
             }
            result.push({
                'barcode': st[0],
                'count': parseFloat(st[1]).toFixed(1)
            })
            continue
        }
        let object = findObject(tag,result)
        if(object != null) {
            object.count++
        }else {
            result.push({
                'barcode': tag,
                'count': 1
            })
        } 
    }
    return result
}

const findObject = (tag,result) => {
    for(let object of result) {
        if(object.barcode === tag) {
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
                    count: aGoods.count,
                    discount: null
                })
                break;
            }
        }
    }
    return result
}

const getGoodsDiscountInfo = goods_base_info => {
    let allPromotions = loadPromotions()
    for(let aGoods of goods_base_info) {
        if(allPromotions[0].barcodes.indexOf(aGoods.barcode) !== -1){
            aGoods.discount = allPromotions.type
        }
    }
    return goods_base_info
}


const calculateCosts = goods_discount_info => {
    let result = '***<没钱赚商店>收据***'+'\n'
    let reduce = 0
    let total = 0
    for(let aGoods of goods_discount_info) {
        let aGoodsCost = 0
        let aPrint = ''
        if(aGoods.discount === null) {
            aGoodsCost = aGoods.count * aGoods.price
        } else {
            if(aGoods.count >= 2) {
                reduce += aGoods.price
                aGoodsCost = (aGoods.count-1) * aGoods.price
            }
        }
        total += aGoodsCost
        aPrint = '名称：' + aGoods.name+'，' + '数量：'+ aGoods.count + aGoods.unit +'，'+ 
        '单价：' + parseFloat(aGoods.price).toFixed(2) + '(元)，'+ '小计：' + parseFloat(aGoodsCost).toFixed(2) +'(元)'+'\n'
        result += aPrint
    }
    result = result +'----------------------'+'\n' + '总计：'+ parseFloat(total).toFixed(2) + '(元)'+'\n' +'节省：' + parseFloat(reduce).toFixed(2) + '(元)' +'\n'+'**********************'
    return result
}