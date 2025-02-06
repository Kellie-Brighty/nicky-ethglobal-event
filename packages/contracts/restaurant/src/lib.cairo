#[starknet::interface]
pub trait IRestaurantManager<TContractState> {
    fn add_restaurant(ref self: TContractState, name: felt252, location: felt252, owner: ContractAddress);
    fn get_restaurant(self: @TContractState, restaurant_id: felt252) -> (felt252, felt252, ContractAddress);
}

#[starknet::contract]
mod RestaurantManager {
    use starknet::storage::{StorageAccess, StorageWriteAccess, Map};
    use starknet::ContractAddress;

    // Define the Restaurant struct
    #[derive(Drop, Serde)]
    struct Restaurant {
        name: felt252,
        location: felt252,
        owner: ContractAddress,
    }

    #[storage]
    struct Storage {
       
        restaurants: Map<felt252, Restaurant>,
        restaurant_count: felt252,
    }

    #[abi(embed_v0)]
    impl RestaurantManagerImpl of super::IRestaurantManager<ContractState> {
      
        fn add_restaurant(ref self: ContractState, name: felt252, location: felt252, owner: ContractAddress) {
        
            let count = self.restaurant_count.read();

            let new_id = count + 1;

           
            self.restaurants.write(new_id, Restaurant { name, location, owner });

            
            self.restaurant_count.write(new_id);
        }

        fn get_restaurant(self: @ContractState, restaurant_id: felt252) -> (felt252, felt252, ContractAddress) {
            let restaurant = self.restaurants.read(restaurant_id);
            (restaurant.name, restaurant.location, restaurant.owner)
        }
    }
}