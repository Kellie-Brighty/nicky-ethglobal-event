use starknet::ContractAddress;

#[starknet::interface]
pub trait IRestaurantManager<TContractState> {
   
    fn add_restaurant(
        ref self: TContractState, name: felt252, location: felt252, owner: ContractAddress,
    );
    fn get_restaurant(
        self: @TContractState, owner: ContractAddress,
    ) -> Option<(felt252, felt252, ContractAddress)>;
   
    fn get_all_restaurants(self: @TContractState) -> Array<(felt252, felt252, ContractAddress)>;
    
    fn get_restaurant_count(self: @TContractState) -> u64;

    fn add_menu_item(
        ref self: TContractState, restaurant_id: u64, name: felt252, description: felt252, price: u64, image_url: felt252
    );



    
}


#[starknet::contract]
mod RestaurantManager {
    use core::starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use starknet::ContractAddress;

    use starknet::storage::{Vec, VecTrait, MutableVecTrait};

    #[derive(Drop, Serde, starknet::Store)]
    struct Order {
        id: u64,
        restaurant_id: u64,
        
        total_price: u64,
        customer: ContractAddress,
        status: felt252,
    }

    #[derive(Drop, Serde, starknet::Store)]
    struct MenuItem {
        id: u64,
        name: felt252,
        description: felt252,
        price: u64,
        image_url: felt252,
        restaurant_id: u64
    }

    #[derive(Drop, Serde, starknet::Store)]
    struct Restaurant {
        id: u64,
        name: felt252,
        location: felt252,
        owner: ContractAddress,
       
        
    }


    #[storage]
    struct Storage {
        next_restaurant_id: u64,
        next_menu_item_id: u64,
        next_order_id: u64,
        name: felt252,
        location: felt252,
        owner: ContractAddress,
        restaurants: Vec<Restaurant>,
        orders: Vec<Order>,
        menu_items: Vec<MenuItem>,

    }

    #[abi(embed_v0)]
    impl RestaurantManagerImpl of super::IRestaurantManager<ContractState> {
        fn add_restaurant(
            ref self: ContractState, name: felt252, location: felt252, owner: ContractAddress
        ) {
            let id = self.next_restaurant_id;
            self.next_restaurant_id += 1;
            let new_restaurant = Restaurant { id, name, location, owner };
            self.restaurants.append().write(new_restaurant);
        }

        fn get_restaurant(
            self: @ContractState, owner: ContractAddress,
        ) -> Option<(felt252, felt252, ContractAddress)> {
            let mut i: u64 = 0;
            loop {
                if i >= self.restaurants.len() {
                    break Option::None;
                }
                let restaurant = self.restaurants.at(i).read();
                if restaurant.owner == owner {
                    break Option::Some((restaurant.name, restaurant.location, restaurant.owner));
                }
                i += 1;
            }
        }

        fn get_all_restaurants(self: @ContractState) -> Array<(felt252, felt252, ContractAddress)> {
            let mut result = ArrayTrait::new();
            let mut i: u64 = 0;
            loop {
                if i >= self.restaurants.len() {
                    break;
                }
                let restaurant = self.restaurants.at(i).read();
                result.append((restaurant.name, restaurant.location, restaurant.owner));
                i += 1;
            };
            result 
        }

        fn get_restaurant_count(self: @ContractState) -> u64 {
            self.restaurants.len()
        }

        fn add_menu_item(
            ref self: ContractState,
            restaurant_id: u64,
            name: felt252,
            description: felt252,
            price: u64,
            image_url: felt252,
        ) {
            let restaurant_exists = self.restaurants.iter().any(|restaurant| restaurant.read().id == restaurant_id);

            if !restaurant_exists {
                let (error_message) = ("Restaurant does not exist".to_string());
                panic!("{}", error_message);
            }

            let id = self.next_menu_item_id;
            self.next_menu_item_id += 1;
            let menu_item = MenuItem {
                id,
                name,
                description,
                price,
                image_url,
                restaurant_id,
            };
            self.menu_items.append().write(menu_item);
        }

        
    }
}
