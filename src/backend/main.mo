import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Product = {
    id : Nat;
    name : Text;
    price : Nat;
    image : ?Text;
  };

  var nextId = 0;

  let productMap = Map.empty<Nat, Product>();

  public shared ({ caller }) func addProduct(name : Text, price : Nat, image : ?Text) : async Product {
    let product : Product = {
      id = nextId;
      name;
      price;
      image;
    };
    productMap.add(nextId, product);
    nextId += 1;
    product;
  };

  public query ({ caller }) func getProductById(id : Nat) : async ?Product {
    productMap.get(id);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    productMap.values().toArray();
  };

  public shared ({ caller }) func updateProduct(id : Nat, name : Text, price : Nat, image : ?Text) : async Bool {
    switch (productMap.get(id)) {
      case (null) { false };
      case (?_) {
        let updatedProduct : Product = {
          id;
          name;
          price;
          image;
        };
        productMap.add(id, updatedProduct);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async Bool {
    switch (productMap.get(id)) {
      case (null) { false };
      case (?_) {
        productMap.remove(id);
        true;
      };
    };
  };
};
