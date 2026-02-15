import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  // Old Product type with price in rupees multiplied by 100.
  type OldProduct = {
    id : Nat;
    name : Text;
    price : Nat;
    image : ?Text;
  };

  type OldActor = {
    var nextId : Nat;
    var productMap : Map.Map<Nat, OldProduct>;
  };

  // New Product type with price in paise.
  type NewProduct = {
    id : Nat;
    name : Text;
    pricePaise : Nat;
    image : ?Text;
  };

  type NewActor = {
    var nextId : Nat;
    var productMap : Map.Map<Nat, NewProduct>;
  };

  public func run(old : OldActor) : NewActor {
    let newProductMap = old.productMap.map<Nat, OldProduct, NewProduct>(
      func(_, oldProduct) {
        {
          id = oldProduct.id;
          name = oldProduct.name;
          pricePaise = oldProduct.price;
          image = oldProduct.image;
        };
      }
    );
    {
      var nextId = old.nextId;
      var productMap = newProductMap;
    };
  };
};
