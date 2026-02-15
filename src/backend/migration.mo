import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type Product = {
    id : Nat;
    name : Text;
    price : Nat;
    image : ?Text;
  };

  type State = {
    var nextId : Nat;
    var productMap : Map.Map<Nat, Product>;
  };

  public func run(state : State) : State {
    state;
  };
};
