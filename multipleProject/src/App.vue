<template>
    <p>Using text interpolation:</p>
    <p>Using text interpolation:</p>
    <img src="@/asset/images/notFound.png" alt="">

    <div class="fl-box">

        <div class="img">img</div>
        <div class="info">
         <div class="info-item">1</div>
         <div class="info-item">1</div>
         <div class="info-item">1</div>

        </div>
    </div>
</template>


<style lang="less">

.fl-box {
    display: flex;
    .img {
        width:64px;
        height:64px;
        background: yellow;
        
    }
    .info {
        display: flex;
        flex-direction: column;
        .info-item {
            flex:1;
            background: red;
        }
    }
}

</style>