import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    name: string;
    pricePaise: bigint;
    image?: string;
}
export interface backendInterface {
    addProduct(name: string, pricePaise: bigint, image: string | null): Promise<Product>;
    deleteProduct(id: bigint): Promise<boolean>;
    getAllProducts(): Promise<Array<Product>>;
    getProductById(id: bigint): Promise<Product | null>;
    updateProduct(id: bigint, name: string, pricePaise: bigint, image: string | null): Promise<boolean>;
}
