import * as React from 'react';

export default class Watermark extends React.Component<any, any> {

    state: any = {}

    componentDidMount() {
        //新建img对象 
        let img = new Image();
        img.width = 440;
        img.height = 300;
        img.src = 'public/merryChristmas.jpg';

        // img加载完成
        img.onload = () => {
            //准备canvas
            let canvas: any = document.getElementById("hide_canvas");
            let context = canvas.getContext("2d");
            
            // 获取 图片 像素信息
            context.drawImage(img, 0, 0);
            const imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);

            // 清空 canvas
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);

            // 获取水印像素信息
            context.font = '40px microsoft yahei';
            context.fillText('hide-watermark', 80, 150);
            const watermarkData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
            
            this.mergeData(imageData, watermarkData.data, context, 'B');
            
            this.parsingData(imageData, context);
        }
    }

    mergeData = (imageData: any, watermarkData: any, ctx: any, color: any) => {
        let oData = imageData.data;
        let bit, offset;  // offset 的作用是找到 A 分量所在数组下标

        // 不同分量对应数组中的下标位置不同
        switch(color){
            case 'R':
                bit = 0;
                offset = 3;
                break;
            case 'G':
                bit = 1;
                offset = 2;
                break;
            case 'B':
                bit = 2;
                offset = 1;
                break;
        }
    
        for(var i = 0; i < oData.length; i++){
            // 只处理目标分量
            if(i % 4 === bit){
                // A 分量是否为 0 作为判断 所在像素有无像素信息 的依据
                if(watermarkData[i + offset] === 0 && (oData[i] % 2 === 1)){
                    // 去除没有信息的像素的干扰
                    if(oData[i] === 255){
                        oData[i]--;
                    } else {
                        oData[i]++;
                    }
                } else if (watermarkData[i + offset] !== 0 && (oData[i] % 2 === 0)){
                    // 有信息的像素，目标分量值设为奇数
                    if(oData[i] === 255){
                        oData[i]--;
                    } else {
                        oData[i]++;
                    }
                }
            }
        }
        // 将结果绘制到画布
        ctx.putImageData(imageData, 0, 0);
    }

    parsingData = (imageData: any, ctx: any) => {
        var data = imageData.data;
        for(var i = 0; i < data.length; i++){
            if(i % 4 === 2){
                // B 分量
                if(data[i] % 2 === 1){
                    data[i] = 255;
                } else {
                    data[i] = 0;
                }
            } else if(i % 4 === 3){
                // A 分量不做处理
                continue;
            } else {
                // 去除其余分量干扰信息
                data[i] = 0;
            }
        }
        // 将结果绘制到画布
        ctx.putImageData(imageData, 0, 0);
    }

    render() {
        return (
            <canvas id="hide_canvas" width="440" height="300"></canvas>
        )
    }
}