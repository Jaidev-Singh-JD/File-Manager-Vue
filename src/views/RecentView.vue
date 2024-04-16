<template>
    <div class="container-bg">
        <div class="d-flex justify-content-between">
            <div class="m-3">
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 m-2">
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="Search...">
                    <span class="input-group-text">
                        <i class="bi bi-search"></i>
                    </span>
                </div>
            </div>
        </div>
        <hr class="mt-1">
        <div>
        <h1 class="text-center">Under Progress</h1>
        </div>
    </div>
</template>
<style scoped>
.container-bg {
    margin: 20px;
    border-radius: 10px;
    height: calc(100vh - 100px);
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #ffffff;
}
</style>