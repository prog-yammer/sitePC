import {groupZoomIn, groupZoomOut, zoomIn, zoomOut} from "../../base/animations/zoom";

const CATEGORY_ACTIVE_CLASS = "category--active";

interface Category {
    id: number;
    categoryElement: HTMLLIElement;
    subcategoryIds: number[],
    activeSubcategory: number;
}

interface Subcategory {
    id: number;
    subcategoryElement: HTMLLIElement;
    productElements: HTMLLIElement[],
}

export class CategoryController {
    constructor(
        categoryTable: HTMLUListElement,
        subcategoryTable: HTMLUListElement,
        cardsTable: HTMLUListElement,
    ) {
        this._categories = new Map();
        this._subcategories = new Map();

        this._activeCategory = -1;
        this._activeSubcategory = -1;

        this._init(categoryTable, subcategoryTable, cardsTable);
    }

    setActiveCategory(id: number) {
        if (id == this._activeCategory) {
            return;
        }

        const activeCategory = this._categories.get(this._activeCategory)!;
        const newActiveCategory = this._categories.get(id)!;

        activeCategory.categoryElement.classList.remove(CATEGORY_ACTIVE_CLASS);
        newActiveCategory.categoryElement.classList.add(CATEGORY_ACTIVE_CLASS);

        const subcategoryElements = new Array<HTMLLIElement>();
        for (const subcategoryId of activeCategory.subcategoryIds) {
            const subcategory = this._subcategories.get(subcategoryId)!;
            subcategoryElements.push(subcategory.subcategoryElement);
        }

        this._activeCategory = id;
        this.setActiveSubcategory(newActiveCategory.activeSubcategory);

        groupZoomOut(subcategoryElements, 300, () => {
            for (const subcategoryId of newActiveCategory.subcategoryIds) {
                const subcategory = this._subcategories.get(subcategoryId)!;
                subcategory.subcategoryElement.style.display = 'block';
                zoomIn(subcategory.subcategoryElement, 300);
            }
        })
    }

    setActiveSubcategory(id: number) {
        if (id == this._activeSubcategory) {
            return;
        }

        const activeCategory = this._categories.get(this._activeCategory)!;
        activeCategory.activeSubcategory = id;

        const activeSubcategory = this._subcategories.get(this._activeSubcategory)!;
        const newActiveSubcategory = this._subcategories.get(id)!;

        activeSubcategory.subcategoryElement.classList.remove(CATEGORY_ACTIVE_CLASS);
        newActiveSubcategory.subcategoryElement.classList.add(CATEGORY_ACTIVE_CLASS);

        groupZoomOut(activeSubcategory.productElements, 300, () => {
            groupZoomIn(newActiveSubcategory.productElements, 300);
        })

        this._activeSubcategory = id;
    }

    private _init(categoryTable: HTMLUListElement, subcategoryTable: HTMLUListElement, cardsTable: HTMLUListElement,) {
        const bySubcategoryId = new Map<number, Array<HTMLLIElement>>;
        const productElements = cardsTable.querySelectorAll('li')!;
        productElements.forEach(element => {
            const subcategoryId = Number(element.getAttribute('data-subcategory-id')!);
            if (!bySubcategoryId.has(subcategoryId)) {
                bySubcategoryId.set(subcategoryId, []);
            }
            bySubcategoryId.get(subcategoryId)!.push(element);
        });

        const byCategoryId = new Map<number, Array<number>>;

        const subcategoryElements = subcategoryTable.querySelectorAll('li')!;
        subcategoryElements.forEach(element => {
            const categoryId = Number(element.getAttribute('data-category-id')!);
            const subcategoryId = Number(element.getAttribute('data-subcategory-id')!);
            if (!byCategoryId.has(categoryId)) {
                byCategoryId.set(categoryId, []);
            }
            byCategoryId.get(categoryId)!.push(subcategoryId);

            const obj: Subcategory = {
                id: subcategoryId,
                subcategoryElement: element,
                productElements: bySubcategoryId.get(subcategoryId) ?? [],
            }
            this._subcategories.set(subcategoryId, obj);

            element.addEventListener('click', () => {
                this.setActiveSubcategory(subcategoryId);
            })
        });

        const categoryElements = categoryTable.querySelectorAll('li')!;

        categoryElements.forEach(element => {
            const id = Number(element.getAttribute('data-category-id')!);
            if (this._activeCategory == -1) {
                this._activeCategory = id;
                this._activeSubcategory = byCategoryId.get(id)!.at(0)!;
            }
            const obj: Category = {
                id,
                categoryElement: element,
                subcategoryIds: byCategoryId.get(id) ?? [],
                activeSubcategory: byCategoryId.get(id)?.at(0) ?? -1,
            }
            this._categories.set(id, obj);

            element.addEventListener('click', () => {
                this.setActiveCategory(id);
            })
        });

        const firstCategory = this._categories.get(this._activeCategory)!;
        firstCategory.categoryElement.classList.add(CATEGORY_ACTIVE_CLASS);

        for (const subcategoryId of firstCategory.subcategoryIds) {
            const subcategory = this._subcategories.get(subcategoryId)!;
            subcategory.subcategoryElement.style.display = 'block';
            if (subcategoryId == firstCategory.activeSubcategory) {
                subcategory.subcategoryElement.classList.add(CATEGORY_ACTIVE_CLASS);
                for (const productElement of subcategory.productElements) {
                    productElement.style.display = 'block';
                }
            }
        }
    }

    private _activeCategory: number;
    private _activeSubcategory: number;
    private readonly _categories: Map<number, Category>;
    private readonly _subcategories: Map<number, Subcategory>;
}