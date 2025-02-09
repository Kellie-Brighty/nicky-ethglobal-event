use starknet::ContractAddress;
use starknet::get_contract_address;

#[starknet::interface]
pub trait IRestaurantManager<TContractState> {
    fn add_restaurant(
        ref self: TContractState,
        name: felt252,
        location: felt252,
        owner: ContractAddress,
        image_url: felt252,
        description: felt252,
    );
    fn get_restaurant(
        self: @TContractState, owner: ContractAddress,
    ) -> Option<(felt252, felt252, ContractAddress, felt252, felt252)>;

    fn get_all_restaurants(
        self: @TContractState,
    ) -> Array<(felt252, felt252, ContractAddress, felt252, felt252)>;

    fn get_restaurant_count(self: @TContractState) -> u64;

    fn add_menu_item(
        ref self: TContractState,
        restaurant_id: u64,
        name: felt252,
        description: felt252,
        price: u64,
        image_url: felt252,
    );

    fn get_restaurant_menu(
        self: @TContractState, restaurant_id: u64,
    ) -> Array<(felt252, felt252, u64, felt252, u64)>;

    fn get_last_uncompleted_payment(
        self: @TContractState, customer: ContractAddress,
    ) -> Option<(u64, u64, felt252)>;


    fn place_order(
        ref self: TContractState, restaurant_id: u64, total_price: u64, customer: ContractAddress,
    ) -> (u64, u64);

    fn make_payment(ref self: TContractState, payment_id: u64);

    fn complete_order(ref self: TContractState, order_id: u64);

    fn get_all_menu_items(self: @TContractState) -> Array<(felt252, felt252, u64, felt252, u64)>;
}


#[starknet::contract]
mod RestaurantManager {
    use core::starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use starknet::ContractAddress;
    use starknet::get_contract_address;

    use starknet::storage::{Vec, VecTrait, MutableVecTrait};


    #[derive(Drop, Serde, starknet::Store, Copy)]
    struct Order {
        id: u64,
        restaurant_id: u64,
        total_price: u64,
        customer: ContractAddress,
        status: felt252,
        payment_id: u64,
    }


    #[derive(Drop, Serde, starknet::Store, Copy)]
    struct Payment {
        order_id: u64,
        amount: u64,
        payer: ContractAddress,
        status: felt252,
    }

    #[derive(Drop, Serde, starknet::Store)]
    struct OrderItem {
        id: u64,
        name: felt252,
        description: felt252,
        price: u64,
        image_url: felt252,
        restaurant_id: u64,
    }

    #[derive(Drop, Serde, starknet::Store)]
    struct MenuItem {
        id: u64,
        name: felt252,
        description: felt252,
        price: u64,
        image_url: felt252,
        restaurant_id: u64,
    }

    #[derive(Drop, Serde, starknet::Store)]
    struct Restaurant {
        id: u64,
        name: felt252,
        location: felt252,
        owner: ContractAddress,
        image_url: felt252,
        description: felt252,
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
        order_items: Vec<OrderItem>,
        payments: Vec<Payment>,
        next_payment_id: u64,
        token_address: ContractAddress,
    }

    const ORDER_STATUS_PENDING: felt252 = 0;
    const ORDER_STATUS_PAID: felt252 = 1;
    const ORDER_STATUS_COMPLETED: felt252 = 2;
    const ORDER_STATUS_CANCELLED: felt252 = 3;

    const PAYMENT_STATUS_PENDING: felt252 = 0;
    const PAYMENT_STATUS_CONFIRMED: felt252 = 1;
    const PAYMENT_STATUS_REFUNDED: felt252 = 2;
    const PAYMENT_STATUS_RELEASED: felt252 = 3;


    #[abi(embed_v0)]
    impl RestaurantManagerImpl of super::IRestaurantManager<ContractState> {
        fn add_restaurant(
            ref self: ContractState,
            name: felt252,
            location: felt252,
            owner: ContractAddress,
            image_url: felt252,
            description: felt252,
        ) {
            let id = self.next_restaurant_id.read();
            self.next_restaurant_id.write(id + 1);
            let new_restaurant = Restaurant { id, name, location, owner, image_url, description };
            self.restaurants.append().write(new_restaurant);
        }

        fn get_restaurant(
            self: @ContractState, owner: ContractAddress,
        ) -> Option<(felt252, felt252, ContractAddress, felt252, felt252)> {
            let mut i: u64 = 0;
            loop {
                if i >= self.restaurants.len() {
                    break Option::None;
                }
                let restaurant = self.restaurants.at(i).read();
                if restaurant.owner == owner {
                    break Option::Some(
                        (
                            restaurant.name,
                            restaurant.location,
                            restaurant.owner,
                            restaurant.image_url,
                            restaurant.description,
                        ),
                    );
                }
                i += 1;
            }
        }

        fn get_all_restaurants(
            self: @ContractState,
        ) -> Array<(felt252, felt252, ContractAddress, felt252, felt252)> {
            let mut result = ArrayTrait::new();
            let mut i: u64 = 0;
            loop {
                if i >= self.restaurants.len() {
                    break;
                }
                let restaurant = self.restaurants.at(i).read();
                result
                    .append(
                        (
                            restaurant.name,
                            restaurant.location,
                            restaurant.owner,
                            restaurant.image_url,
                            restaurant.description,
                        ),
                    );
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
            let mut restaurant_exists = false;
            let mut i: u64 = 0;
            loop {
                if i >= self.restaurants.len() {
                    break;
                }
                let restaurant = self.restaurants.at(i).read();
                if restaurant.id == restaurant_id {
                    restaurant_exists = true;
                    break;
                }
                i += 1;
            };

            if !restaurant_exists {
                panic!("Restaurant does not exist");
            }

            let id = self.next_menu_item_id.read();
            self.next_menu_item_id.write(id + 1);
            let menu_item = MenuItem { id, name, description, price, image_url, restaurant_id };
            self.menu_items.append().write(menu_item);
        }

        fn get_restaurant_menu(
            self: @ContractState, restaurant_id: u64,
        ) -> Array<(felt252, felt252, u64, felt252, u64)> {
            let mut menu_items = ArrayTrait::new();
            let mut i: u64 = 0;
            loop {
                if i >= self.menu_items.len() {
                    break;
                }
                let menu_item = self.menu_items.at(i).read();
                if menu_item.restaurant_id == restaurant_id {
                    menu_items
                        .append(
                            (
                                menu_item.name,
                                menu_item.description,
                                menu_item.price,
                                menu_item.image_url,
                                menu_item.id,
                            ),
                        );
                }
                i += 1;
            };
            menu_items
        }


        fn place_order(
            ref self: ContractState,
            restaurant_id: u64,
            total_price: u64,
            customer: ContractAddress,
        ) -> (u64, u64) {
            let mut restaurant_exists = false;
            let mut i: u64 = 0;
            loop {
                if i >= self.restaurants.len() {
                    break;
                }
                let restaurant = self.restaurants.at(i).read();
                if restaurant.id == restaurant_id {
                    restaurant_exists = true;
                    break;
                }
                i += 1;
            };
            assert(restaurant_exists, 'Restaurant does not exist');

            
            let order_id = self.next_order_id.read();
            self.next_order_id.write(order_id + 1);
            let new_order = Order {
                id: order_id,
                restaurant_id,
                total_price,
                customer,
                status: ORDER_STATUS_PENDING,
                payment_id: 0,
            };
            self.orders.append().write(new_order);

            let payment_id = self.next_payment_id.read();
            self.next_payment_id.write(payment_id + 1);
            let new_payment = Payment {
                order_id, amount: total_price, payer: customer, status: PAYMENT_STATUS_PENDING,
            };
            self.payments.append().write(new_payment);

        
            let mut order = self.orders.at(order_id).read();
            order.payment_id = payment_id;
            self.orders.at(order_id).write(order);

            (order_id, payment_id)
        }

        fn make_payment(ref self: ContractState, payment_id: u64) {
            let mut payment = self.payments.at(payment_id).read();
            assert(payment.status == PAYMENT_STATUS_PENDING, 'Payment already processed');

            payment.status = PAYMENT_STATUS_CONFIRMED;
            self.payments.at(payment_id).write(payment);
        }

        fn complete_order(ref self: ContractState, order_id: u64) {
            let order = self.orders.at(order_id).read();
            assert(order.status == ORDER_STATUS_PENDING, 'Order not pending');

            let payment = self.payments.at(order.payment_id).read();
            assert(payment.status == PAYMENT_STATUS_CONFIRMED, 'Payment not confirmed');

            let total_amount = payment.amount;
            let restaurant_amount = total_amount * 95 / 100;
            let fee_amount = total_amount - restaurant_amount;

            //let restaurant = self.restaurants.at(order.restaurant_id).read();
            //let restaurant_wallet = restaurant.owner;

            //let token_address = get_contract_address();

            //let token = IERC20 { contract_address: token_address };
            //IERC20Dispatcher { contract_address: token_address }.transfer(RESTAURANT_ADDRESS,
            //restaurant_amount)

            let mut updated_order = order;
            updated_order.status = ORDER_STATUS_COMPLETED;
            self.orders.at(order_id).write(updated_order);

            let mut updated_payment = payment;
            updated_payment.status = PAYMENT_STATUS_RELEASED;
            self.payments.at(order.payment_id).write(updated_payment);
        }


        fn get_last_uncompleted_payment(
            self: @ContractState, customer: ContractAddress,
        ) -> Option<(u64, u64, felt252)> {
            let mut last_uncompleted_payment: Option<(u64, u64, felt252)> = Option::None;
            let mut i: u64 = 0;

            loop {
                if i >= self.payments.len() {
                    break;
                }
                let payment = self.payments.at(i).read();

                if payment.payer == customer && payment.status == PAYMENT_STATUS_PENDING {
                    last_uncompleted_payment =
                        Option::Some((payment.order_id, payment.amount, payment.status));
                };

                i += 1;
            };

            last_uncompleted_payment
        }


        fn get_all_menu_items(
            self: @ContractState,
        ) -> Array<(felt252, felt252, u64, felt252, u64)> {
            let mut menu_items = ArrayTrait::new();
            let mut i: u64 = 0;
            loop {
                if i >= self.menu_items.len() {
                    break;
                }
                let menu_item = self.menu_items.at(i).read();
                menu_items
                    .append(
                        (
                            menu_item.name,
                            menu_item.description,
                            menu_item.price,
                            menu_item.image_url,
                            menu_item.id,
                        ),
                    );
                i += 1;
            };
            menu_items
        }
    }
}
