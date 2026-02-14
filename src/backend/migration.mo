import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type Product = {
    id : Nat;
    name : Text;
    price : Nat;
    image : ?Text;
  };

  type OldActor = {};
  type NewActor = {
    var nextId : Nat;
    productMap : Map.Map<Nat, Product>;
  };

  public func run(_ : OldActor) : NewActor {
    { var nextId = 0; productMap = Map.empty<Nat, Product>() };
  };
};
