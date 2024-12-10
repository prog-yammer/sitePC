import {executeOnReady} from "../base/utils/dom";
import {CategoryController} from "./category/category_controller";
import {ProductController} from "./product/product_controller";
import {ModalController} from "./product/modal_controller";

executeOnReady(() => {

const categoryController = new CategoryController(
    document.querySelector('.categories')!,
    document.querySelector('.subcategories')!,
    document.querySelector('.cards')!,
);

const modalController = new ModalController(
    document.querySelector('.modal')!,
);

const productController = new ProductController(
    document.querySelector('.cards')!,
    modalController
)

});
